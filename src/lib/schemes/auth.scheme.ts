import z from "zod";

export const authSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstName: z.string().min(2, "First name must be at least 2 characters long").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters long").optional(),
});
