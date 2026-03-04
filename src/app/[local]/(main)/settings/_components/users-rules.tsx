"use client";

import { updateUserRuleAction } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function UsersRules({ currentUser, users }: { currentUser: User; users: User[] }) {
  const t = useTranslations("Settings");
  if (currentUser.rule !== "admin") return null;

  return (
    <div className="space-y-4">
      {users.map((u) => (
        <form
          key={u.id}
          onSubmit={async (e) => {
            e.preventDefault();
            await updateUserRuleAction(u.id, u.rule);
            toast.success(t("updateRuleSuccess"));
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
            <option value="admin">{t("admin")}</option>
            <option value="user">{t("user")}</option>
          </select>

          <Button type="submit">{t("update")}</Button>
        </form>
      ))}
    </div>
  );
}
