/* eslint-disable @typescript-eslint/no-explicit-any */
import { signUpSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import geterrorMessage from "@/utils/errorMessage";
import axiosInstance from "@/utils/axiosInstance";

const Signup = () => {
  // const [username, setUsername] = useState<string>("");
  // const [usernameMessage, setUsernameMessage] = useState<string>("");
  // const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      avatar: undefined,
      coverImage: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("fullName", data.fullName);
    formData.append("avatar", data.avatar ?? "");
    formData.append("coverImage", data.coverImage ?? "");
    await axiosInstance
      .post("/users/register", formData)
      .then((response) => response.data)
      .then((data) => {
        toast({
          title: data.message,
        });
        navigate("/login");
      })
      .catch((error) => {
        const errorMessage = geterrorMessage((error as any).response.data);

        toast({
          title: errorMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="text-blue-700">
        <h1 className="text-3xl font-bold my-8 text-center text-blue-600">
          Sign Up
        </h1>
        <div className="w-3/4 md:w-2/6 mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Full Name" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Username" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Email" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Password" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="images/*"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="images/*"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                        }}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSubmitting ? (
                <Button type="submit" className="dark:text-white" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sign Up
                </Button>
              ) : (
                <Button type="submit" className="dark:text-white">
                  Sign Up
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Signup;
