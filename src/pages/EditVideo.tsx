/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
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
import { useToast } from "@/hooks/use-toast";
import { VideoSchema, videoUploadSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

function EditVideo() {
  const { videoId } = useParams<{ videoId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState<VideoSchema | undefined>(undefined);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    undefined
  );

  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize the form
  const form = useForm<z.infer<typeof videoUploadSchema>>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      videoFile: undefined,
      thumbnail: undefined,
    },
  });

  // Fetch the video to edit
  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchVideo = async () => {
        if (!videoId) return;
        const response = await axiosInstance.get(`/videos/${videoId}`);
        setVideo(response.data.data);
        form.setValue("title", response.data.data.title);
        form.setValue("description", response.data.data.description);
        setThumbnailPreview(response.data.data.thumbnailUrl);
      };
      fetchVideo();
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response.data);
      console.error("Error fetching video:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    form.setValue("thumbnail", file);
  };

  const handleRemoveThumbnail = () => {
    form.setValue("thumbnail", undefined);
    setThumbnailPreview(undefined);
  };

  const onSubmit = async (data: z.infer<typeof videoUploadSchema>) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      console.log("Sending request to update video:", videoId);
      const response = await axiosInstance.patch(
        `/videos/${videoId}`,
        formData
      );
      console.log("Update response:", response.data);
      toast({
        title: response.data.message || "Success",
        description: "Your video has been updated successfully!",
      });
      navigate(`/video/${videoId}`);
    } catch (error) {
      console.error("Error updating video:", error);
      const errorMessage = geterrorMessage((error as any)?.response?.data || error);
      toast({
        title: "Error",
        description: errorMessage || "Failed to update video",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    console.log("Update button clicked");
    const formState = form.getValues();
    console.log("Current form state:", formState);
    
    form.handleSubmit(onSubmit)();
  };

  return !isLoading ? (
    <div>
      <h1 className="p-4 text-2xl font-bold text-primary">Edit Video</h1>

      <div className="updateForm md:w-2/3 mx-auto p-4 flex flex-col gap-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Edit Your Video Details</CardTitle>
            <CardDescription>
              Update your Video title, description or thumbnail
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form 
              className="px-6 py-4" 
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submit event triggered");
                form.handleSubmit(onSubmit)(e);
              }}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title for your video"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter description for your video"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-3" />

              <FormField
                control={form.control}
                name="thumbnail"
                render={() => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Video Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                      />
                    </FormControl>
                    {thumbnailPreview && (
                      <div className="flex items-center gap-2">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          className="w-32 aspect-video object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveThumbnail}
                          className="text-red-500 aspect-auto hover:text-red-700"
                        >
                          Remove Thumbnail
                        </button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSubmitting ? (
                <Button disabled className="text-3xl text-secondary-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating ...
                </Button>
              ) : (
                <Button
                  type="button" 
                  className="w-full my-6 text-secondary-foreground"
                  onClick={handleButtonClick}
                >
                  Update Video
                </Button>
              )}
            </form>
          </Form>
        </Card>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
}

export default EditVideo;
