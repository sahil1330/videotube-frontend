import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }).min(1).max(255),
  username: z
    .string()
    .min(3, { message: "Username must be atleast 3 characters." })
    .max(20, { message: "Username must not be more than 20 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters." })
    .max(40, { message: "Password is too long." }),
});
