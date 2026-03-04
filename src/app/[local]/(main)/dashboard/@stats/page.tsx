import { getStats } from "@/lib/actions/stats.action";
import { getTranslations } from "next-intl/server";
import AddProgress from "./_components/AddProgress";
import { findByUser } from "@/lib/actions/skills.action";
import StatsCard from "./_components/StatsCard";

export default async function Page() {
  const data = await getStats();
  const t = await getTranslations("Stats");
  const skills = await findByUser();

  return (
    <main className="min-h-full bg-background text-foreground p-6 space-y-10">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{t("recentActivity")}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t("trackProgress")}</p>
      </header>

      {/* Main Content */}
      <section className="grid gap-10 lg:grid-cols-1">
        {/* Activity Timeline */}
        <aside className="space-y-6">
          <div className="">
            <h2 className="text-lg font-medium">{t("recentActivity")}</h2>
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
