"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

// Pages accessible without being logged in
const PUBLIC_PATHS = ["/", "/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && !PUBLIC_PATHS.includes(pathname)) {
        router.push("/login");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !PUBLIC_PATHS.includes(pathname)) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  // The landing page renders immediately, without spinner or app layout
  if (pathname === "/") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow the login page to render without AppShell wrapper
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // The 'Nouvelle Facture' page has a full-screen, custom layout (focus mode)
  const isFocusMode = pathname === "/factures/nouvelle";

  if (isFocusMode) {
    return (
      <div className="flex min-h-screen bg-white">
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
