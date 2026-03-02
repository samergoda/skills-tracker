import "server-only";

import { db } from "@/db/db";
import { progressEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromToken } from "../util/authTools";
import { revalidateTag } from "next/cache";

export const statsRepository = {
  async findByUser() {
    const user = await getUserFromToken();

    // Get user's data
    return db.query.progressEntries.findMany({ where: eq(progressEntries.userId, user.id) });
  },

  async create(data: Pick<Stats, "skillId" | "hours" | "note" | "completionPercent">) {
    const user = await getUserFromToken();
    console.log("create progressssss", data);

    const id = crypto.randomUUID();

    await db.insert(progressEntries).values({
      id,
      userId: user.id,
      skillId: data.skillId,
      hours: data.hours,
      note: data.note,
      completionPercent: data.completionPercent,
      updatedAt: new Date().toISOString(),
    });

    // Revalidate after success
    revalidateTag(`stats-user-${user.id}`, "max");
  },
};
