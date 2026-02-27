"use client";

import { Button } from "@/components/ui/button";

export default function ActionsSkillsList() {
  return (
    <div className="mt-6 flex justify-between items-center">
      <Button variant="outline" size="xs" className="text-sm  hover:underline">
        Edit
      </Button>

      <Button variant="outline" size="xs" className="text-sm text-red-600 hover:underline">
        Delete
      </Button>
    </div>
  );
}
