import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPosts,
  useCreatePost,
  useVerifyAdmin,
  getGetPostsQueryKey,
} from "@workspace/api-client-react";
import { CreatePostInputType } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pass");
    if (saved) {
      setPassword(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const verifyMutation = useVerifyAdmin();
  const { data: posts } = useGetPosts();
  const createMutation = useCreatePost();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          setIsAuthenticated(true);
          sessionStorage.setItem("admin_pass", password);
        },
        onError: () => {
          toast({ title: "Wrong password", variant: "destructive" });
        },
      }
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_pass");
    setPassword("");
    setIsAuthenticated(false);
  };

  const [form, setForm] = useState({
    title: "",
    type: "text" as CreatePostInputType,
    content: "",
    mediaUrl: "",
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        data: {
          ...form,
          mediaUrl: form.mediaUrl || null,
          adminPassword: password,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Posted" });
          setForm({ title: "", type: "text", content: "", mediaUrl: "" });
          queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() });
        },
        onError: () => {
          toast({ title: "Failed to post", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPassword: password }),
      });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: getGetPostsQueryKey() });
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-xs mx-auto mt-32">
          <p className="text-zinc-500 text-sm mb-4">password</p>
          <form onSubmit={handleLogin} className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-b border-zinc-700 text-white text-sm py-1 outline-none focus:border-zinc-400 placeholder:text-zinc-700"
              placeholder="enter password"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {verifyMutation.isPending ? "..." : "go"}
            </button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-sm">admin</span>
          <button
            onClick={handleLogout}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            log out
          </button>
        </div>

        {/* New Post Form */}
        <div className="space-y-5">
          <p className="text-sm text-zinc-400">new post</p>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600">title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="bg-transparent border-b border-zinc-800 text-white text-sm py-1 outline-none focus:border-zinc-500 placeholder:text-zinc-700"
                placeholder="post title"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600">type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as CreatePostInputType })
                }
                className="bg-black border-b border-zinc-800 text-white text-sm py-1 outline-none focus:border-zinc-500 w-full"
              >
                <option value="text">text</option>
                <option value="image">image</option>
                <option value="video">video</option>
                <option value="script">code</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600">content</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={5}
                className={`bg-transparent border border-zinc-800 text-white text-sm p-2 outline-none focus:border-zinc-500 resize-none rounded ${
                  form.type === "script" ? "font-mono" : ""
                }`}
                placeholder={form.type === "script" ? "paste code here" : "write something"}
              />
            </div>

            {(form.type === "image" || form.type === "video") && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-600">media url</label>
                <input
                  type="url"
                  value={form.mediaUrl}
                  onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                  required
                  className="bg-transparent border-b border-zinc-800 text-white text-sm py-1 outline-none focus:border-zinc-500 placeholder:text-zinc-700"
                  placeholder="https://..."
                />
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="text-sm text-white border border-zinc-700 rounded px-4 py-1.5 hover:border-zinc-500 transition-colors disabled:opacity-40"
            >
              {createMutation.isPending ? "posting..." : "post"}
            </button>
          </form>
        </div>

        {/* Existing Posts */}
        {posts && posts.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">posts</p>
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAdmin={true}
                  onDelete={handleDelete}
                  isDeleting={isDeleting === post.id}
                />
              ))}
            </div>
          </div>
        )}

        {posts?.length === 0 && (
          <p className="text-zinc-700 text-sm">no posts yet</p>
        )}
      </div>
    </Layout>
  );
}
