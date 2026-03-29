import { Layout } from "@/components/Layout";
import { ProfileCard } from "@/components/ProfileCard";
import { PostCard } from "@/components/PostCard";
import { useGetPosts } from "@workspace/api-client-react";

const USER_ID = "1399544240287256718";

export default function Home() {
  const { data: posts, isLoading } = useGetPosts();

  return (
    <Layout>
      <ProfileCard userId={USER_ID} />

      <div className="mt-14">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="h-20 w-full bg-white/[0.03] rounded animate-pulse" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div>
            {posts.map((post, i) => (
              <div key={post.id}>
                <PostCard post={post} />
                {i < posts.length - 1 && (
                  <div className="border-t border-white/[0.05] my-6" />
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
