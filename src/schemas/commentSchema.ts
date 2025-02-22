import { z } from "zod";

export const commentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment should not be empty.")
    .max(10000, { message: "Comment must be less than 10000 characters." }),
});
