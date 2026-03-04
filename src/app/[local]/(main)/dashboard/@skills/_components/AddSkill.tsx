"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSkill } from "@/lib/actions/skills.action";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

export default function AddSkill() {
  const t = useTranslations("Skills");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      difficulty: "",
    },
  });

  async function onSubmit(data: { name: string; category: string; difficulty: string }) {
    console.log("create skill", data);
    try {
      const result = await createSkill(data);
      if (result.success) {
        reset({
          name: "",
          category: "",
          difficulty: "",
        });
        console.log("✓ Skill created successfully. Page will be updated automatically.");
      } else {
        console.error("✗ " + "Failed to add skill");
      }
    } catch (error) {
      console.error("✗ Error creating skill:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("addSkill")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addNewSkill")}</DialogTitle>
          <DialogDescription>{t("addSkillDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label htmlFor="skill-name">{t("name")}</Label>
              <Input
                id="skill-name"
                type="text"
                placeholder={t("namePlaceholder")}
                {...register("name", { required: t("nameRequired") })}
                disabled={isSubmitting}
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </Field>
            <Field>
              <Label htmlFor="skill-category">{t("category")}</Label>
              <Input
                id="skill-category"
                type="text"
                placeholder={t("categoryPlaceholder")}
                {...register("category", { required: t("categoryRequired") })}
                disabled={isSubmitting}
              />
              {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
            </Field>
            <Field>
              <Label htmlFor="skill-difficulty">{t("difficulty")}</Label>
              <Input
                id="skill-difficulty"
                type="text"
                placeholder={t("difficultyPlaceholder")}
                {...register("difficulty", { required: t("difficultyRequired") })}
                disabled={isSubmitting}
              />
              {errors.difficulty && <span className="text-red-500 text-sm">{errors.difficulty.message}</span>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("cancel")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("creating") : t("addSkill")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
