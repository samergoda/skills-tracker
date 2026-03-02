import { getStats } from "@/lib/actions/stats.action";
import { getTranslations } from "next-intl/server";
import AddProgress from "./_components/AddProgress";
import { findByUser } from "@/lib/actions/skills.action";
import StatsCard from "./_components/StatsCard";

export default async function Page() {
  const data = await getStats();
  const t = await getTranslations("HomePage");
  const skills = await findByUser();

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 space-y-10">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm text-neutral-400 mt-2">Track your skill progress and recent activity</p>
      </header>

      {/* Main Content */}
      <section className="grid gap-10 lg:grid-cols-1">
        {/* Activity Timeline */}
        <aside className="space-y-6">
          <div className="">
            <h2 className="text-lg font-medium">Recent Activity</h2>
            <AddProgress skills={skills} />
          </div>

          <div className="space-y-4 grid gap-10 lg:grid-cols-1">
            {data.map((log: Stats) => (
              <StatsCard key={log.id} log={log} />
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="text-sm text-neutral-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
