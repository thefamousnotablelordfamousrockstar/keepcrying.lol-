import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-8xl font-display font-black text-primary">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="mt-4">Return Home</Button>
        </Link>
      </div>
    </Layout>
  );
}
