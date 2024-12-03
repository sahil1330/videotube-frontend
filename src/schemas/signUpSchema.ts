import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters." })
    .max(20, { message: "Username must not be more than 20 characters." })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Username can only contain letters, numbers and underscores.",
    }),
  email: z.string().email({ message: "Invalid Email Address" }).min(1).max(255),
  fullName: z.string().min(1).max(255),
  avatar: z.string().min(1).max(255),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters." })
    .max(40, {message: "Password is too long."}),
  coverImage: z.string().min(1).max(255),
});