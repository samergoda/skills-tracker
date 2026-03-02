"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSkill, deleteSkill } from "@/lib/actions/skills.action";

export default function ActionsSkillsList({ skill }: { skill: Skill }) {
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
            Edit
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update skill information below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} disabled={isSubmitting} />
            </div>

            <div>
              <Label>Category</Label>
              <Input {...register("category")} disabled={isSubmitting} />
            </div>

            <div>
              <Label>Difficulty</Label>
              <Input {...register("difficulty")} disabled={isSubmitting} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE ================= */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="xs" className="text-red-600">
            Delete
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{skill.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={onDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
