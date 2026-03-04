"use client";

import { updateUserRuleAction } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import { CustomError } from "@/lib/util/customError";
import { toast } from "sonner";

export default function UsersRules({ currentUser, users }: { currentUser: User; users: User[] }) {
  if (currentUser.rule !== "admin") return null;

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <form
          key={u.id}
          onSubmit={async (e) => {
            e.preventDefault();
            await updateUserRuleAction(u.id, u.rule);
            toast.success("Updated user rule");
            // if (res instanceof CustomError) res.toast();
          }}
          className="flex items-center gap-4">
          <input type="hidden" name="id" value={u.id} />

          <div className="flex-1">
            <p>
              {u.firstName} {u.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{u.email}</p>
          </div>

          <select name="rule" defaultValue={u.rule} className="border rounded px-2 py-1">
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <Button type="submit">Update</Button>
        </form>
      ))}
    </div>
  );
}
