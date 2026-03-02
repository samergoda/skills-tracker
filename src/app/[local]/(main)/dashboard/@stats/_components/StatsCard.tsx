"use client";
import { Button } from "@/components/ui/button";
import { deleteState } from "@/lib/actions/stats.action";
import { Trash } from "lucide-react";

export default function StatsCard({ log }: { log: Stats }) {
  return (
    <div key={log.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
      <div className="text-sm flex justify-between text-neutral-400">
        {new Intl.DateTimeFormat("en-US", {
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

      <div className="mt-2 text-xs text-neutral-500">Completion: {log.completionPercent}%</div>
    </div>
  );
}
