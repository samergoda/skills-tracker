"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createState } from "@/lib/actions/stats.action";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

export default function AddProgress({ skills }: { skills: Skill[] }) {
  const t = useTranslations("Stats");
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
        <select {...register("skillId", { required: t("skillRequired") })}>
          <option value="">{t("selectSkill")}</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
        {errors.skillId && <p className="text-red-500">{errors.skillId.message}</p>}

        <Input type="text" {...register("note")} placeholder={t("notePlaceholder")} />

        <Label>{t("progress")}</Label>
        <Input
          type="number"
          min={0}
          max={100}
          {...register("completionPercent", {
            required: t("progressRequired"),
            valueAsNumber: true,
            min: { value: 0, message: t("minProgress") },
            max: { value: 100, message: t("maxProgress") },
          })}
          placeholder={t("progressPlaceholder")}
        />
        {errors.completionPercent && <p className="text-red-500">{errors.completionPercent.message}</p>}

        <Label>{t("hours")}</Label>
        <Input
          type="number"
          min={0}
          max={24}
          {...register("hours", {
            required: t("hoursRequired"),
            valueAsNumber: true,
            min: { value: 0, message: t("minHours") },
            max: { value: 24, message: t("maxHours") },
          })}
          placeholder={t("hoursPlaceholder")}
        />
        {errors.hours && <p className="text-red-500">{errors.hours.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("adding") : t("addProgress")}
        </Button>
      </form>
    </div>
  );
}
