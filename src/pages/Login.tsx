import { signInSchema } from "@/schemas";
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
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import geterrorMessage from "@/utils/errorMessage";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    await axios
      .post("/api/v1/users/login", data)
      .then((res) => res.data)
      .then((data) => {
        toast({
          title: data.message,
        });
        dispatch(login(data.data.user));
        console.log("Login data: ", data.data.user);
        // console.log(useSelector((state: any) => state.auth.user));
        navigate("/");
      })
      .catch((error) => {
        // const errorData = error.response.data;
        // const preRegex = /<pre>(.*?)<\/pre>/s;
        // const match = preRegex.exec(errorData);
        const errorMessage = geterrorMessage(error.response.data);
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
          Sign In
        </h1>
        <div className="w-3/4 md:w-2/6 mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Username or Email"
                        {...field}
                      />
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

              {isSubmitting ? (
                <Button type="submit" className="dark:text-white" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sign In
                </Button>
              ) : (
                <Button type="submit" className="dark:text-white">
                  Sign In
                </Button>
              )}
            </form>
          </Form>
          <p className="text-center m-4 text-secondary-foreground">
            Not registered?{" "}
            <Link to={"/Signup"} className="text-blue-600">
              Signup
            </Link>{" "}
            here
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
