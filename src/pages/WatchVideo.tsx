/* eslint-disable @typescript-eslint/no-explicit-any */
// import TransformedImage from "@/components/ImageTransformation.tsx/TransformedImage";
import CommentSection from "@/components/CommentSection/CommentSection";
import TransformedVideo from "@/components/ImageTransformation.tsx/TransformedVideo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import VideoSchema from "@/schemas/VideoSchema";
import { authState } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { Download, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

function WatchVideo() {
    const { slug } = useParams();
    const [video, setVideo] = useState<VideoSchema>();
    const [subscribers, setSubscribers] = useState<number>(0);
    // const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [subscribedStatus, setSubscribedStatus] = useState({
        value: "Subscribe",
        isSubscribed: false,
    });
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(0);
    const [isDisliked, setIsDisliked] = useState<boolean>(false);
    const [isInfoContainerOpen, setIsInfoContainerOpen] = useState<boolean>(false);
    const { toast } = useToast();
    // const infoRef = useRef<HTMLDivElement>(null);
    const userDetails = useSelector((state: authState) => state.auth.user);
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axiosInstance.get(`/videos/${slug}`);
                setVideo(response.data.data);
                const subscribers = await axiosInstance.get(`/subscriptions/subscribers/${response.data.data.owner._id}`);
                setSubscribers(subscribers.data.data.length);
                if (subscribers.data.data.find((subscribers: any) => subscribers.subscriber._id === userDetails?._id)) {
                    setSubscribedStatus({ value: "Unsubscribe", isSubscribed: true });
                }
                else {
                    setSubscribedStatus({ value: "Subscribe", isSubscribed: false });
                }
                const likesData = await axiosInstance.get(`/likes/get-video-likes/${slug}`);
                setLikes(likesData.data.data.videoLikesCount);
                if (likesData.data.data.videoLikes.find((like: any) => like.likedBy._id === userDetails?._id)) {
                    setIsLiked(true);
                    setIsDisliked(false);
                }
                else {
                    setIsLiked(false);
                }
            } catch (error) {
                const errorMessage = geterrorMessage((error as any)?.response?.data);
                toast({
                    title: errorMessage,
                    variant: "destructive",
                });
            }
        }

        fetchVideo();
    }, []);

    const toggleSubscription = async () => {
        try {
            await axiosInstance.post(`/subscriptions/toggle/${video?.owner._id}`);
            const subscribers = await axiosInstance.get(`/subscriptions/subscribers/${video?.owner._id}`);
            setSubscribers(subscribers.data.data.length);
        } catch (error) {
            const errorMessage = geterrorMessage((error as any)?.response?.data);
            toast({
                title: errorMessage,
                variant: "destructive",
            });
        }
    }
    const toggleLike = async () => {
        await axiosInstance.post(`/likes/toggle-video-like/${video?._id}`);
        const likesData = await axiosInstance.get(`/likes/get-video-likes/${video?._id}`);
        setLikes(likesData.data.data.videoLikesCount);
        if (likesData.data.data.videoLikes.find((like: any) => like.likedBy._id === userDetails?._id)) {
            setIsLiked(true);
            setIsDisliked(false);
        }
        else {
            setIsLiked(false);
        }
    }
    const handleSubscribe = () => {
        if (subscribedStatus.isSubscribed) {
            setSubscribedStatus({ value: "Subscribe", isSubscribed: false });
        }
        else {
            setSubscribedStatus({ value: "Unsubscribe", isSubscribed: true });
        }
        toggleSubscription();
    }
    const handleLike = async () => {
        if (isLiked) {
            setIsLiked(false);
        }
        else {
            setIsLiked(true);
            setIsDisliked(false);
            setLikes(likes + 1);
        }
        toggleLike();
    }
    const handleDislike = async () => {
        if (isDisliked) {
            setIsDisliked(false)
        }
        else {
            setIsDisliked(true)
            if (isLiked) {
                setIsLiked(false)
                setLikes(likes - 1)
                await axiosInstance.post(`/likes/toggle-video-like/${video?._id}`);
                const likesData = await axiosInstance.get(`/likes/get-video-likes/${video?._id}`);
                setLikes(likesData.data.data.videoLikesCount);
            }
        }
    }
    const handleShare = async () => {
        window.navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Video Link copied to clipboard, Share it with your friends",
            variant: "default",
        });
    }
    const handleDownload = async () => {
        try {
            const response = await fetch(video?.videoFile as string);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = video?.title as string;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast({
                title: "Video download started",
                variant: "default",
            });
        } catch (error) {
            const errorMessage = geterrorMessage((error as any)?.response?.data);
            toast({
                title: errorMessage,
                variant: "destructive",
            });
        }
    }
    return (
        <>
            <div className="wrapper w-11/12  mx-auto flex ">
                {video && (
                    <div className="left lg:w-4/6">
                        <div className="video-player">
                            <div className="aspect-video rounded-xl bg-muted/50 w-full" >
                                <TransformedVideo videoPublicId={video.videoFilePublicId} width={'100%'} height={'100%'} poster={video.thumbnail} controls={true} sourceConfig={{
                                    info: { title: video.title, artist: video.owner?.fullName },
                                    options: { autoplay: true }
                                }} />
                            </div>
                            <h1 className="text-2xl font-bold my-2">{video.title}</h1>
                            <div className="video-engagement-buttons flex items-center gap-4">
                                <div className="left-flex w-1/2 flex items-center gap-4">
                                    <div className="avatar w-[60px] h-[60px] rounded-full">
                                        <Avatar className="h-[54px] w-[54px] aspect-square">
                                            <AvatarImage src={video.owner.avatar} alt={video.owner.username} className="rounded-full" />
                                            <AvatarFallback>{video.owner.username as any}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <Link to={`/${video.owner.username}`} className="video-owner-details">
                                        <p className="text-lg font-bold">{video.owner.fullName}</p>
                                        <p className="text-md">{subscribers} subscribers</p>
                                    </Link>
                                    {/* <Separator orientation="vertical" className="border border-black " /> */}

                                    {userDetails?._id !== video.owner?._id && (
                                        // isSubscribed ? (<Button variant="secondary" className="">Unsubscribe</Button>) : (<Button variant="secondary" className="">Subscribe</Button>)
                                        <Button variant="secondary" className="" onClick={handleSubscribe}>{subscribedStatus.
                                            value}</Button>
                                    )}
                                </div>
                                <div className="right-flex w-1/2 flex justify-end gap-4">
                                    <div className="like-dislike">
                                        <div className="flex items-center border border-black rounded-lg">
                                            <Button variant="ghost" onClick={handleLike}>{isLiked ? (<ThumbsUp fill="" />) : (<ThumbsUp />)}{likes} </Button>
                                            <Separator orientation="vertical" className="border border-black h-8" />
                                            <Button variant="ghost" onClick={handleDislike}>{isDisliked ? (<ThumbsDown fill="" />) : (<ThumbsDown />)}</Button>
                                        </div>
                                    </div>
                                    <div className="shareButton">
                                        <Button variant="secondary" onClick={handleShare}><Share /> Share</Button>
                                    </div>
                                    <div className="downloadButton">
                                        <Button variant="secondary" onClick={handleDownload}><Download /> Download</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="info-container bg-slate-500/10 p-4 h-auto contain-content rounded-lg mt-4">
                                <div className="enagement">
                                    <p>{video.views} views</p>
                                    <div className="text-lg">
                                        {isInfoContainerOpen ? (
                                            <>
                                                <p>{video.description}</p>
                                                <Button variant={"ghost"} onClick={() => setIsInfoContainerOpen(false)}>Read Less ...</Button>
                                            </>
                                        ) : (
                                            <>
                                                <p>{video.description.substring(0, 100)}...</p>
                                                <Button variant={"ghost"} onClick={() => setIsInfoContainerOpen(true)}>Read More...</Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CommentSection videoId={video._id} userDetails={userDetails} />
                    </div>
                )}
            </div >
        </>
    )
}

export default WatchVideo