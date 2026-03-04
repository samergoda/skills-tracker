"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSkill, deleteSkill } from "@/lib/actions/skills.action";
import { useTranslations } from "next-intl";

export default function ActionsSkillsList({ skill }: { skill: Skill }) {
  const t = useTranslations("Skills");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: skill.name,
      category: skill.category,
      difficulty: skill.difficulty,
    },
  });

  async function onEditSubmit(data: any) {
    await updateSkill(skill.id, data);
    setEditOpen(false);
  }

  async function onDelete() {
    await deleteSkill(skill.id);
    setDeleteOpen(false);
  }

  return (
    <div className="mt-6 flex justify-between items-center">
      {/* ================= EDIT ================= */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="xs">
            {t("edit")}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editSkill")}</DialogTitle>
            <DialogDescription>{t("editSkillDescription")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <Label>{t("name")}</Label>
              <Input {...register("name")} disabled={isSubmitting} />
            </div>

            <div>
              <Label>{t("category")}</Label>
              <Input {...register("category")} disabled={isSubmitting} />
            </div>

            <div>
              <Label>{t("difficulty")}</Label>
              <Input {...register("difficulty")} disabled={isSubmitting} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                {t("cancel")}
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE ================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="xs" className="text-red-600">
            {t("delete")}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteSkill")}</DialogTitle>
            <DialogDescription>{t("deleteSkillConfirm", { name: skill.name })}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              {t("cancel")}
            </Button>

            <Button variant="destructive" onClick={onDelete}>
              {t("confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
