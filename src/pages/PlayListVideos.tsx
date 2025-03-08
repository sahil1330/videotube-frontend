import { useToast } from "@/hooks/use-toast";
import VideoSchema from "@/schemas/VideoSchema";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import React, { useState } from "react";
import { useParams } from "react-router";

function PlayListVideos() {
  const { slug } = useParams();
  const [playlistId, setPlaylistId] = useState<string | undefined>(undefined);
  const [playlistVideos, setPlaylistVideos] = useState<Array<VideoSchema>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchPlaylistVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/playlists/${slug}/videos`);
      setPlaylistVideos(response.data.data.videos);
      setPlaylistId(response.data.data._id);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching playlist videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary p-4">PlayList Videos</h1>
      <p className="text-xl">This is the PlayList Videos page.</p>
      <p className="text-lg">You can add your videos here.</p>
    </div>
  );
}

export default PlayListVideos;
