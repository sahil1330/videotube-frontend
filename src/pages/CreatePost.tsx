/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Image, Loader2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";

// Post schema for validation
const postSchema = z.object({
  postContent: z.string().min(1, "Post content is required"),
  postImage: z.instanceof(File).optional(),
});

function CreatePost() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      postContent: "",
      postImage: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", data.postContent);
      formData.append("tweetImage", data.postImage ?? "");

      const response = await axiosInstance.post("/tweets", formData);
      toast({
        title: response.data.message,
        description: "Your post has been created successfully!",
      });
      navigate(`/tweet/${response.data.data.owner.username}`);
    } catch (error: any) {
      console.log(error);
      const errorMessage = geterrorMessage(error?.response?.data);
      toast({
        title: "Error creating post",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("postImage", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    form.setValue("postImage", undefined);
    setPreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            Create New Post
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts, ideas, or experiences with the community
          </p>
        </div>

        <Card className="border border-muted/40 shadow-lg">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="postContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        What's on your mind?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts, ideas, or experiences with the community..."
                          className="min-h-[150px] resize-y focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        Add an Image
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 ${
                                previewUrl
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Camera className="w-10 h-10 text-gray-500 mb-3" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  SVG, PNG, JPG or GIF (Max: 10MB)
                                </p>
                              </div>
                              <Input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                ref={imageInputRef}
                                onChange={handleImageChange}
                                name={field.name}
                                onBlur={field.onBlur}
                              />
                            </label>
                          </div>

                          {previewUrl && (
                            <div className="relative rounded-lg overflow-hidden">
                              <img
                                src={previewUrl}
                                alt="Post Preview"
                                className="w-full h-auto max-h-80 object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 rounded-full w-8 h-8"
                                onClick={removeImage}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add a high-quality image to make your post stand out
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  {isSubmitting ? (
                    <Button disabled className="min-w-[120px]">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="min-w-[120px] bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600"
                    >
                      Publish Post
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreatePost;
