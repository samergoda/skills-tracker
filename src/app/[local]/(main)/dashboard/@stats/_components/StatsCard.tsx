"use client";
import { Button } from "@/components/ui/button";
import { deleteState } from "@/lib/actions/stats.action";
import { Trash } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function StatsCard({ log }: { log: Stats }) {
  const t = useTranslations("Stats");
  const locale = useLocale();

  return (
    <div key={log.id} className="bg-card border border-border rounded-xl p-4">
      <div className="text-sm flex justify-between text-muted-foreground">
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(log.createdAt))}

        <Button variant="ghost" size="icon" onClick={() => deleteState(log.id)}>
          <Trash className="text-red-500" />
        </Button>
      </div>

      <div className="mt-2 text-sm">
        <span className="font-medium">{log.hours}h</span> — {log.note}
      </div>

      <div className="mt-2 text-xs text-muted-foreground">{t("completion", { percent: log.completionPercent })}</div>
    </div>
  );
}
