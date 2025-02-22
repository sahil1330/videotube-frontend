/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import UserSchema from "@/schemas/UserSchema";
import VideoSchema from "@/schemas/VideoSchema";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

function Account() {
    const { slug } = useParams();
    const username = slug;
    const [isOwner, setIsOwner] = useState(false);
    const [isAccountFound, setIsAccountFound] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();
    // console.log("username: ", username);
    const userDetailsRef = useRef(useSelector((state: any) => state.auth.user));
    const [accountVideos, setAccountVideos] = useState<Array<VideoSchema>>([]);
    let userDetails: UserSchema | null = null;
    useEffect(() => {
        if (userDetails && userDetails.username === username) {
            // navigate("/");
            setIsOwner(true);
        } else {
            (async function () {
                try {
                    const response = await axiosInstance.get(`/users/c/${username}`);
                    userDetailsRef.current = response.data;
                    // userDetails = response.data;
                } catch (error: any) {
                    const errorMessage = geterrorMessage(error?.response?.data);
                    toast({
                        title: errorMessage,
                        variant: "destructive",
                    });
                    setIsAccountFound(false);
                }
            })();
        }
        (async function () {
            const accountVideosResponse = await axiosInstance.get(`/videos?sortBy=createdAt&sortType=desc&userId=${userDetailsRef.current?._id}`);
            setAccountVideos(accountVideosResponse?.data?.data?.docs);
            console.log(accountVideosResponse?.data?.data?.docs);
        })()
    }, [toast, userDetails, username]);
    userDetails = userDetailsRef.current;
    return isAccountFound ? (
        <div>
            <div className="account-header flex items-center w-full py-4 px-10 gap-10 text-blue-600">
                <div className="account-avatar w-40 h-40 border rounded-full overflow-hidden">
                    <img src={userDetails?.avatar} alt={userDetails?.username} />
                </div>
                <div className="account-details">
                    <h1 className="text-3xl font-bold">{userDetails?.username}</h1>
                    <p className="text-md">{userDetails?.email}</p>
                    {isOwner && (
                        <div className="account-actions my-4">
                            <Button variant="outline" className="outline-blue-600 mx-2" onClick={() => navigate("/edit-profile")} size="sm">Edit Profile</Button>
                            <Button variant="outline" className="outline-blue-600 mx-2" size="sm">Manage Videos</Button>
                        </div>
                    )}
                </div>
            </div>
            <Separator />
            <h2 className="px-10 py-4 text-3xl font-bold text-blue-500">Videos</h2>
            <div className="account-videos w-full py-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-11/12 mx-auto">
                    {accountVideos.length > 0 && accountVideos.map((video, index) => (
                        <VideoCard key={index} {...video} />
                    ))}
                </div>
            </div>
        </div >
    ) : ("Account not found")
}

export default Account