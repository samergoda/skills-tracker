import { ReactNode, Suspense } from "react";

export default function Layout({
  children,
  skills,
  stats,
}: {
  children: ReactNode;
  skills: ReactNode;
  stats: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-8xl mx-auto px-6 py-10 space-y-12">
        {/* Top Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Skills (Primary) */}
          <section className="lg:col-span-2">
            <Suspense fallback={"Loading..."}>{skills}</Suspense>
          </section>

          {/* Stats (Secondary / Sidebar on Desktop) */}
          <aside>
            <Suspense fallback={"Loading..."}>{stats}</Suspense>
          </aside>
        </div>

        {/* Page Content Below */}
        <div className="border-t border-neutral-800 pt-10">{children}</div>
      </div>
    </main>
  );
}
