"use client";

import { Button } from "@/components/ui/button";
import { createState } from "@/lib/actions/stats.action";
import { useForm } from "react-hook-form";

type AddProgressForm = {
  skillId: string;
  note: string;
  progress: number;
};

export default function AddProgress({ skills }: { skills: Skill[] }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddProgressForm>({
    defaultValues: {
      skillId: "",
      note: "",
      progress: 0,
    },
  });

  const onSubmit = async (data: AddProgressForm) => {
    if (data.progress < 0 || data.progress > 100) return;

    await createState({
      skillId: data.skillId,
      hours: data.progress,
      note: data.note,
      completionPercent: data.progress,
    });

    reset();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <select {...register("skillId", { required: "Skill is required" })} className="border p-2">
          <option value="">Select skill</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
        {errors.skillId && <p>{errors.skillId.message}</p>}

        <input type="text" {...register("note")} className="border p-2" placeholder="Note" />

        <input
          type="number"
          min={0}
          max={100}
          {...register("progress", {
            required: "Progress is required",
            valueAsNumber: true,
            min: { value: 0, message: "Min is 0" },
            max: { value: 100, message: "Max is 100" },
          })}
          className="border p-2"
          placeholder="Progress (0-100)"
        />
        {errors.progress && <p>{errors.progress.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Progress"}
        </Button>
      </form>
    </div>
  );
}
