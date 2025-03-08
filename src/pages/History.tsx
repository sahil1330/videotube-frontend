/* eslint-disable @typescript-eslint/no-explicit-any */
import VideoSchema from "@/schemas/VideoSchema";
import { authState } from "@/types";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

function History() {
    const [videos, setVideos] = useState<VideoSchema[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { toast } = useToast();
    const pageSize = 10;
    const userDetails = useSelector((state: authState) => state.auth.user);

    // Intersection Observer setup for infinite scrolling
    const observer = useRef<IntersectionObserver | null>(null);
    const lastVideoElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const fetchWatchedVideos = useCallback(async () => {
        if (!userDetails?.watchHistory?.length) return;

        setLoading(true);       
        try {
            // Get the slice of video IDs for the current page
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const videoIdsToFetch = userDetails.watchHistory.slice(start, end);

            if (videoIdsToFetch.length === 0) {
                setHasMore(false);
                return;
            }

            // Fetch videos one by one
            const fetchedVideos: any[] = [];
            for (const videoId of videoIdsToFetch) {
                // Fetch video details using the video ID
                if (videos.some(video => video._id === videoId)) continue; // Skip if already fetched
                try {
                    const response = await axiosInstance.get(`/videos/${videoId}`);
                    fetchedVideos.push(response.data.data);
                } catch (err) {
                    console.error(`Failed to fetch video with ID: ${videoId}`, err);
                    // Continue with other videos even if one fails
                }
            }

            setVideos((prev) => [...prev, ...fetchedVideos]);
            setHasMore(videoIdsToFetch.length === pageSize && end < userDetails.watchHistory.length);
        } catch (error) {
            console.error("Error fetching watched videos:", error);
            toast({
                title: "Failed to fetch watch history",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [page, userDetails?.watchHistory, toast, pageSize]);

    useEffect(() => {
        fetchWatchedVideos();
    }, [fetchWatchedVideos]);

    return (
        <div className="p-4 min-h-screen">
            <h1 className="text-3xl text-primary font-bold mb-6">Watch History</h1>
            <div className="">
                {videos.map((video, index) => (
                    <Link to={`/watch/${video._id}`} key={video._id}>
                        <div
                            className="bg-gray dark:bg-slate-900 rounded-lg shadow-md overflow-hidden flex mb-4"
                            ref={
                                index === videos.length - 1 ? lastVideoElementRef : undefined
                            }
                        >
                            <video
                                src={video.videoFile}
                                poster={video.thumbnail}
                                muted
                                className="aspect-video w-96 object-cover"
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => e.currentTarget.pause()}
                            />
                            <div className="p-4">
                                <div className="text-lg font-semibold">{video.title}</div>
                                <p className="text-sm text-gray-600">
                                    {formatDistanceToNow(new Date(video.createdAt), {
                                        addSuffix: true,
                                    })}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center mt-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}

            {!hasMore && videos.length > 0 && (
                <p className="text-center mt-6 text-gray-500">No more videos to load</p>
            )}

            {!hasMore && videos.length === 0 && (
                <p className="text-center mt-6 text-gray-500">No watch history found</p>
            )}
        </div>
    );
}

export default History;
