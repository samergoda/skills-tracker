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

export default function AddSkill() {
  // const [isOpen, setIsOpen] = useState(false);
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
        // Reset form
        reset({
          name: "",
          category: "",
          difficulty: "",
        });

        // Close dialog
        // setIsOpen(false);

        // Show success feedback
        console.log("✓ Skill created successfully. Page will be updated automatically.");
      } else {
        // Show error feedback
        console.error("✗ " + "Failed to add skill");
      }
    } catch (error) {
      console.error("✗ Error creating skill:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add skill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new skill</DialogTitle>
          <DialogDescription>
            Create a new skill to track your learning progress. The skill list will update automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Label htmlFor="skill-name">Name</Label>
              <Input
                id="skill-name"
                type="text"
                placeholder="Enter skill name"
                {...register("name", { required: "Skill name is required" })}
                disabled={isSubmitting}
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </Field>
            <Field>
              <Label htmlFor="skill-category">Category</Label>
              <Input
                id="skill-category"
                type="text"
                placeholder="Enter skill category"
                {...register("category", { required: "Category is required" })}
                disabled={isSubmitting}
              />
              {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
            </Field>
            <Field>
              <Label htmlFor="skill-difficulty">Difficulty</Label>
              <Input
                id="skill-difficulty"
                type="text"
                placeholder="e.g., Beginner, Intermediate, Advanced"
                {...register("difficulty", { required: "Difficulty is required" })}
                disabled={isSubmitting}
              />
              {errors.difficulty && <span className="text-red-500 text-sm">{errors.difficulty.message}</span>}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Add skill"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
