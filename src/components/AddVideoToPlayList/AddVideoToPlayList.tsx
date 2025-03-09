/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import geterrorMessage from "@/utils/errorMessage";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { VideoSchema } from "@/schemas";
import { UserSchema } from "@/schemas";
import { ListVideo, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

const FormSchema = z.object({
  playlistId: z.string().min(1, "Playlist ID is required"),
});

function AddVideoToPlayList({
  userDetails,
  video,
}: {
  userDetails: UserSchema;
  video: VideoSchema;
}) {
  const [playlistId, setPlaylistId] = React.useState<string>("");
  const [playLists, setPlayLists] = React.useState<any[]>([]);
  const [playListsLoading, setPlayListsLoading] = React.useState(false);
  const dialogCloseButtonRef = useRef(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const getAvailablePlayLists = async () => {
    setPlayListsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/playlists/user/${userDetails?._id}`
      );
      console.log("Playlists ", response.data.data);
      if (response.data.data.length > 0) {
        setPlayLists(response.data.data);
      } else {
        toast({
          title: "No Playlists available",
          variant: "default",
        });
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setPlayListsLoading(false);
    }
  };

  const addVideoToPlaylist = async (videoId: string) => {
    try {
      const response = await axiosInstance.post(
        `/playlists/add-video/${playlistId}`,
        {
          videoId,
        }
      );
      console.log("Video added to playlist: ", response.data);
      toast({
        title: "Video added to playlist",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      if (dialogCloseButtonRef.current) {
        (dialogCloseButtonRef.current as any).click();
      }
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setPlaylistId(data.playlistId);
    console.log("Selected Playlist ID: ", data.playlistId);
    addVideoToPlaylist(video._id);
  };
  return (
    <div className="addToPlayListButton">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            onClick={() => {
              getAvailablePlayLists();
            }}
          >
            <ListVideo />
            <span className="hidden md:inline">Save Video</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose PlayList</DialogTitle>
            <DialogDescription>
              Choose in which playlist, you want to add this video
            </DialogDescription>
          </DialogHeader>
          <div className="playlists flex flex-col gap-4 text-primary dark:text-white">
            {playListsLoading ? (
              <Loader2 className="animate-spin w-10 " />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="playlistId"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setPlaylistId(value);
                        }}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        {playLists.length === 0 && (
                          <div className="text-sm text-muted-foreground">
                            No playlists available
                          </div>
                        )}
                        {playLists.length > 0 && (
                          <div className="text-sm text-muted-foreground space-y-2">
                            {playLists.map((playlist) => (
                              <div
                                key={playlist._id}
                                className="flex items-center space-x-2"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={playlist._id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {playlist.name}
                                  </FormLabel>
                                </FormItem>
                              </div>
                            ))}
                          </div>
                        )}
                      </RadioGroup>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      className="text-destructive-foreground"
                      type="submit"
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </div>
          <DialogClose asChild className="hidden">
            <Button
              ref={dialogCloseButtonRef}
              type="button"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddVideoToPlayList;
