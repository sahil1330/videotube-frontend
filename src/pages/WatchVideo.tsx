/* eslint-disable @typescript-eslint/no-explicit-any */
// import TransformedImage from "@/components/ImageTransformation.tsx/TransformedImage";
import TransformedVideo from "@/components/ImageTransformation.tsx/TransformedVideo";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import VideoSchema from "@/schemas/VideoSchema";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function WatchVideo() {
    const { slug } = useParams();
    console.log(slug)
    const [video, setVideo] = useState<VideoSchema>();
    const { toast } = useToast();
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axiosInstance.get(`/videos/${slug}`);
                setVideo(response.data.data);
                console.log("Response " + response.data)
            } catch (error) {
                console.log(error);
                const errorMessage = geterrorMessage((error as any)?.response?.data);
                toast({
                    title: errorMessage,
                    variant: "destructive",
                });
            }
        }
        fetchVideo();
        console.log("Video " + video)
    }, []);
    return (
        <>
            <div className="wrapper w-5/6 flex mx-auto">
                <div className="video-player flex ">
                    <div className="aspect-video rounded-xl bg-muted/50 w-full" >
                        {video && (
                            <div>
                                <TransformedVideo videoPublicId={video.videoFilePublicId} poster={video.thumbnail} controls={true} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )
}

export default WatchVideo