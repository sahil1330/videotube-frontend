import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Loader2, Upload } from "lucide-react";
import { authState } from "@/types";
import { login } from "@/store/authSlice";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Create a schema for profile editing
const profileEditSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Username can only contain letters, numbers and underscores",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  avatar: z.any().optional(),
  coverImage: z.any().optional(),
});

function EditProfile() {
  const userDetails = useSelector((state: authState) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize the form
  const form = useForm<z.infer<typeof profileEditSchema>>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
    },
  });

  // Load user data into the form when available
  useEffect(() => {
    if (userDetails) {
      form.reset({
        fullName: userDetails.fullName || "",
        username: userDetails.username || "",
        email: userDetails.email || "",
      });
      setAvatarPreview(userDetails.avatar);
      setCoverPreview(userDetails.coverImage);
    }
  }, [userDetails, form]);

  const onSubmit = async (data: z.infer<typeof profileEditSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);

      if (data.avatar && data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }

      if (data.coverImage && data.coverImage instanceof File) {
        formData.append("coverImage", data.coverImage);
      }

      const response = await axiosInstance.patch(
        "/users/update-account",
        formData
      );

      // Update Redux store with the updated user data
      dispatch(login(response.data.data));

      toast({
        title: "Profile updated successfully",
      });

      // Navigate back to the account page
      navigate(`/${data.username}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("coverImage", file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Edit Profile</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your profile information and manage your account
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Cover Image Section */}
              <div>
                <FormLabel className="text-base">Cover Image</FormLabel>
                <div className="mt-2 relative group">
                  <div
                    className="h-48 w-full rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundImage: coverPreview
                        ? `url(${coverPreview})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {!coverPreview && (
                      <span className="text-slate-400">
                        No cover image selected
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <label
                        htmlFor="cover-image-upload"
                        className="cursor-pointer bg-white/80 text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-white"
                      >
                        <Upload size={16} />
                        Change Cover
                      </label>
                      <input
                        id="cover-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverImageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                    <AvatarImage
                      src={avatarPreview || ""}
                      alt="Profile picture"
                    />
                    <AvatarFallback className="text-2xl">
                      {userDetails?.fullName
                        ? userDetails.fullName[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload size={18} className="text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <p className="text-sm text-gray-500">
                    JPG, PNG or GIF. Max size 1MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" className="border-blue-500" />
                      </FormControl>
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
                        <Input {...field} placeholder="Your username" />
                      </FormControl>
                      <FormDescription>
                        This will be used in your profile URL.
                      </FormDescription>
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
                        <Input
                          {...field}
                          placeholder="Your email address"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/${userDetails?.username}`)}
              >
                Cancel
              </Button>

              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default EditProfile;
