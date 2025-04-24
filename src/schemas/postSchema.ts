import { z } from "zod";

export const postSchema = z.object({
  postContent: z.string().min(1, { message: "Post content is required." }),
  postImage: z
    .instanceof(File)
    .refine((file) => file.size < 1000000, {
      message: "Post Image size must be less than 1MB.",
    })
    .optional(),
});
