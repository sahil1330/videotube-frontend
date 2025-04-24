import { VideoCard } from "@/components";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { VideoSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Plus } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router";

const Home = () => {
  const [videos, setVideos] = useState<Array<VideoSchema>>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchVideos = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/videos?sortBy=createdAt&sortType=desc&page=${pageNumber}&limit=10`
      );

      const newVideos = response.data.data.docs;

      if (pageNumber === 1) {
        setVideos(newVideos);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
      }

      setHasMore(newVideos.length > 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  };

  useEffect(() => {
    // Initial load
    fetchVideos(1);
  }, []);

  useEffect(() => {
    // Load more when page changes, but not on initial load
    if (page > 1) {
      fetchVideos(page);
    }
  }, [page]);

  // Last element ref callback for intersection observer
  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.5 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {videos.map((video, index) => {
            if (videos.length === index + 1) {
              return (
                <div ref={lastVideoElementRef} key={video._id}>
                  <VideoCard {...video} />
                </div>
              );
            } else {
              return <VideoCard key={video._id} {...video} />;
            }
          })}
        </div>
        {loading && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        )}
        {!hasMore && videos.length > 0 && (
          <div className="py-4 text-center text-gray-500">
            No more videos to load
          </div>
        )}
        <div className="min-h-[20vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
      <div className="uploadVideoButton">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="fixed bottom-8 right-8 p-4 rounded-full text-white"
          >
            <Button variant="default" className="w-14 h-14">
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="flex items-center bg-primary gap-2">
              <Link to={"/upload-video"}>Upload Video</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center bg-primary gap-2">
              <Link to={"/create-post"}> Create Post</Link>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default Home;
