import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

router.get("/posts", async (req, res) => {
  try {
    const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
    res.json(posts.map(p => ({
      id: p.id,
      type: p.type,
      title: p.title,
      content: p.content,
      mediaUrl: p.mediaUrl,
      createdAt: p.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts", async (req, res) => {
  const { type, title, content, mediaUrl, adminPassword } = req.body as {
    type: string;
    title: string;
    content: string;
    mediaUrl?: string;
    adminPassword: string;
  };

  if (adminPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!type || !title || !content) {
    res.status(400).json({ error: "type, title, and content are required" });
    return;
  }

  try {
    const [post] = await db.insert(postsTable).values({
      type,
      title,
      content,
      mediaUrl: mediaUrl ?? null,
    }).returning();

    res.status(201).json({
      id: post.id,
      type: post.type,
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  const { adminPassword } = req.body as { adminPassword?: string };

  if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const deleted = await db.delete(postsTable).where(eq(postsTable.id, id)).returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    req.log.error({ err }, "Failed to delete post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/verify", (req, res) => {
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, message: "Authenticated" });
  } else {
    res.status(401).json({ error: "Wrong password" });
  }
});

export default router;
