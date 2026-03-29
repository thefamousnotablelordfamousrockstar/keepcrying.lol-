import * as React from "react";
import { Link, useLocation } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <nav className="w-full pt-7 pb-3">
        <div className="max-w-lg mx-auto px-5 flex items-center justify-between">
          <Link href="/">
            <span className="text-[13px] text-zinc-400 hover:text-white transition-colors">
              keepcrying.lol
            </span>
          </Link>
          {location === "/admin" && (
            <Link href="/">
              <span className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors">
                ← back
              </span>
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-lg mx-auto px-5 pb-24">
        {children}
      </main>
    </div>
  );
}
