import { formatDistanceToNow } from "date-fns";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Post } from "@workspace/api-client-react/src/generated/api.schemas";

interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export function PostCard({ post, isAdmin, onDelete, isDeleting }: PostCardProps) {
  const date = new Date(post.createdAt);

  return (
    <div className="group">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h3 className="text-white font-medium text-[15px] leading-snug">{post.title}</h3>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-zinc-600">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              disabled={isDeleting}
              className="text-[11px] text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              delete
            </button>
          )}
        </div>
      </div>

      {post.type === "text" && (
        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {post.type === "script" && (
        <div className="mt-1 rounded-md overflow-hidden border border-white/[0.06]">
          <SyntaxHighlighter
            language="javascript"
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: "14px 16px",
              background: "#0d0d0d",
              fontSize: "12.5px",
              lineHeight: "1.6",
            }}
          >
            {post.content}
          </SyntaxHighlighter>
        </div>
      )}

      {post.type === "image" && (
        <div className="space-y-3">
          {post.content && (
            <p className="text-zinc-400 text-sm leading-relaxed">{post.content}</p>
          )}
          {post.mediaUrl && (
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="rounded-md w-full h-auto max-h-[480px] object-cover border border-white/[0.06]"
              loading="lazy"
            />
          )}
        </div>
      )}

      {post.type === "video" && (
        <div className="space-y-3">
          {post.content && (
            <p className="text-zinc-400 text-sm leading-relaxed">{post.content}</p>
          )}
          {post.mediaUrl && (
            <video
              src={post.mediaUrl}
              controls
              className="rounded-md w-full border border-white/[0.06]"
            />
          )}
        </div>
      )}
    </div>
  );
}
