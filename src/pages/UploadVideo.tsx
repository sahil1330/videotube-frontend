import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { videoUploadSchema } from "@/schemas/videoUploadSchema";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

function UploadVideo() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof videoUploadSchema>>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      videoFile: undefined,
      thumbnail: undefined,
    }
  })

  const onSubmit = async (data: z.infer<typeof videoUploadSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("videoFile", data.videoFile ?? "");
      formData.append("thumbnail", data.thumbnail ?? "");
      const response = await axiosInstance.post("/videos", formData);
      toast({
        title: response.data.message,
      });
      navigate("/");
    } catch (error: any) {
      console.log(error);
      const errorMessage = geterrorMessage(error?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="heading w-full h-4 my-4 flex justify-center items-center">
        <h1 className="text-4xl text-blue-600 font-bold">Upload Video</h1>
      </div>
      <div className="w-3/4 md:w-4/6 mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title for your video" {...field} />
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
                    <Textarea placeholder="Type your message here." id="message" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Import Video Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={thumbnailInputRef}
                      onChange={(e) => {
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <div className="relative w-1/4 h-1/4">
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(undefined);
                          if (thumbnailInputRef.current) {
                            thumbnailInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-0 right-0 bg-white p-1 rounded-full text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <FormDescription>
                    <p>Thumbnail should be in 16:9 aspect ratio</p>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="videoFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Import Video File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
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
              <Button type="submit" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Export Video
              </Button>
            ) : (
              <Button type="submit">Export Video</Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default UploadVideo