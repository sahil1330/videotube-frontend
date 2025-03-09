/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@/hooks/use-toast";
import { VideoSchema } from "@/schemas";
import { authState } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import {
  Loader2,
  Plus,
  PlayCircle,
  ListMusic,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: VideoSchema[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const userDetails = useSelector((state: authState) => state.auth.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/playlists/user/${userDetails?._id}`
      );
      setPlaylists(response.data.data);
      console.log("Playlists", response.data.data);
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response?.data);
      toast({
        title: errorMessage,
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      toast({
        title: "Playlist name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/playlists/create-playlist", {
        name: playlistName,
        description: playlistDescription,
      });

      if (response.data.statusCode === 201) {
        toast({
          title: response?.data?.message || "Playlist created successfully",
          variant: "default",
        });

        // Add the new playlist to the state
        const newPlaylist = response.data.data;
        setPlaylists((prev) => [...prev, newPlaylist]);

        // Reset form and close dialog
        setPlaylistName("");
        setPlaylistDescription("");
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const response = await axiosInstance.delete(`/playlists/${playlistId}`);

      if (response.data.success) {
        // Remove the deleted playlist from state
        setPlaylists(
          playlists.filter((playlist) => playlist._id !== playlistId)
        );

        toast({
          title: "Playlist deleted successfully",
          variant: "default",
        });
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen relative">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">My Playlists</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ListMusic className="w-16 h-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No playlists yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first playlist to organize your favorite videos
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 dark:text-white"
              >
                Create Playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card
                  key={playlist._id}
                  className="overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <Link
                    to={`/playlists/${playlist._id}`}
                    className="block h-full"
                  >
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white relative pb-12">
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.preventDefault()}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeletePlaylist(playlist._id);
                              }}
                            >
                              Delete Playlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle>{playlist.name}</CardTitle>
                      <CardDescription className="text-blue-100">
                        {playlist.videos.length}{" "}
                        {playlist.videos.length === 1 ? "video" : "videos"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        {playlist.videos.slice(0, 4).map((video) => (
                          <div
                            key={video._id}
                            className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
                          >
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <PlayCircle className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {playlist.description || "No description"}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-2 text-xs text-gray-500">
                      Created{" "}
                    </CardFooter>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Playlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>
              Create a new playlist to organize your favorite videos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Describe your playlist"
                className="resize-none h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 dark:text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Playlist"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-blue-500 hover:bg-blue-600"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="h-6 w-6" color="white" />
      </Button>
    </div>
  );
}

export default Playlists;
