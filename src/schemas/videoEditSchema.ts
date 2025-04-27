import { z } from "zod";

export const videoEditSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, {
      message: "Thumbnail File size must be less than 10MB.",
    })
    .optional(),
});
