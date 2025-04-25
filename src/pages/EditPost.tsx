/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, X, Upload } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { postSchema } from "@/schemas";

type PostFormValues = z.infer<typeof postSchema>;

function EditPost() {
  const { postId } = useParams<{ postId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      postContent: "",
      postImage: undefined,
    },
  });

  // Fetch the post to edit
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/tweets/${postId}`);
        const post = response.data.data;

        form.reset({
          postContent: post.content || "",
          postImage: undefined,
        });

        if (post.contentImage) {
          setImagePreview(post.contentImage);
        }
      } catch (error) {
        console.error("Error fetching playlist videos:", error);
        const errorMessage = geterrorMessage((error as any)?.response?.data);
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId, form, toast, navigate]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set the image in the form
    form.setValue("postImage", file);
  };

  const handleRemoveImage = () => {
    setImagePreview(undefined);
    form.setValue("postImage", undefined);
  };

  const onSubmit = async (data: PostFormValues) => {
    if (!postId) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", data.postContent);

      if (data.postImage) {
        formData.append("tweetImage", data.postImage);
      }

      await axiosInstance.patch(`/tweets/${postId}`, formData);

      toast({
        title: "Post updated successfully",
        variant: "default",
      });

      // Navigate back to the community tab or profile page
      navigate(-1);
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: "Failed to update post",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Edit Post</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Edit Your Post</CardTitle>
          <CardDescription>Update your post content or image</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Post Content */}
              <FormField
                control={form.control}
                name="postContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's on your mind?"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Post Image */}
              <div className="space-y-2">
                <FormLabel>Post Image</FormLabel>
                <FormDescription>
                  Upload an image for your post (optional)
                </FormDescription>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mt-2 w-full max-h-[300px] overflow-hidden rounded-md">
                    <img
                      src={imagePreview}
                      alt="Post"
                      className="object-contain w-full h-auto max-h-[300px]"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Upload Button */}
                {!imagePreview && (
                  <div className="flex items-center justify-center h-40 w-full border-2 border-dashed rounded-md border-gray-300 dark:border-gray-700">
                    <label
                      htmlFor="postImage"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">Upload Image</span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG or GIF up to 1MB
                      </span>
                      <input
                        id="postImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              {isSubmitting ? (
                <Button disabled className="bg-blue-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
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

export default EditPost;
