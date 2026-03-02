import { db } from "@/db/db";
import "server-only";

export async function getProgressEntries() {
  return db.query.progressEntries.findMany();
}
