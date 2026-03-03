"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createState } from "@/lib/actions/stats.action";
import { useForm } from "react-hook-form";

export default function AddProgress({ skills }: { skills: Skill[] }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Pick<Stats, "skillId" | "hours" | "note" | "completionPercent">>({
    mode: "onChange",
    defaultValues: {
      skillId: "",
      note: "",
      hours: undefined,
      completionPercent: undefined,
    },
  });

  const onSubmit = async (data: Pick<Stats, "skillId" | "hours" | "note" | "completionPercent">) => {
    if (data.hours < 0 || data.completionPercent > 100) return;

    await createState({
      skillId: data.skillId,
      hours: data.hours,
      note: data.note,
      completionPercent: data.completionPercent,
    });

    reset();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <select {...register("skillId", { required: "Skill is required" })}>
          <option value="">Select skill</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
        {errors.skillId && <p className="text-red-500">{errors.skillId.message}</p>}

        <Input type="text" {...register("note")} placeholder="Note" />

        <Label>Progress</Label>
        <Input
          type="number"
          min={0}
          max={100}
          {...register("completionPercent", {
            required: "Progress is required",
            valueAsNumber: true,
            min: { value: 0, message: "Min is 0" },
            max: { value: 100, message: "Max is 100" },
          })}
          placeholder="Progress (0-100)"
        />
        {errors.completionPercent && <p className="text-red-500">{errors.completionPercent.message}</p>}

        <Label>Hours</Label>
        <Input
          type="number"
          min={0}
          max={24}
          {...register("hours", {
            required: "Hours is required",
            valueAsNumber: true,
            min: { value: 0, message: "Min is 0" },
            max: { value: 24, message: "Max is 24" },
          })}
          placeholder="Hours (0-24)"
        />
        {errors.hours && <p className="text-red-500">{errors.hours.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Progress"}
        </Button>
      </form>
    </div>
  );
}
