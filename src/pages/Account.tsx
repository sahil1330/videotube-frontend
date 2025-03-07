/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import UserSchema from "@/schemas/UserSchema";
import VideoSchema from "@/schemas/VideoSchema";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { Loader2 } from "lucide-react";
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
    const userDetailsRef = useRef<UserSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accountVideos, setAccountVideos] = useState<Array<VideoSchema>>([]);
    const [accountDetails, setAccountDetails] = useState<UserSchema | null>(null);
    const currentUser = useSelector((state: any) => state.auth.user);
    useEffect(() => {
        setIsLoading(true)
        if (currentUser && currentUser.username === username) {
            // navigate("/");
            setIsOwner(true);
            userDetailsRef.current = currentUser;
            setAccountDetails(currentUser);
        } else {
            (async function () {
                try {
                    const response = await axiosInstance.get(`/users/c/${username}`);
                    userDetailsRef.current = response.data.data;
                    setAccountDetails(response.data.data);
                    setIsOwner(false);
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
        setIsLoading(false);
    }, []);
    useEffect(() => {
        (async function () {
            try {
                if (accountDetails?._id) {
                    const accountVideosResponse = await axiosInstance.get(`/videos?sortBy=createdAt&sortType=desc&userId=${accountDetails?._id}`);
                    setAccountVideos(accountVideosResponse?.data?.data?.docs);
                }
            } catch (error) {
                const errorMessage = geterrorMessage((error as any)?.response?.data);
                toast({
                    title: errorMessage,
                    variant: "destructive",
                });
            }
        })()

    }, [accountDetails])
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        </div>
    }
    return isAccountFound ? (
        <div>
            <div className="account-header flex items-center w-full py-4 px-10 gap-10 text-blue-600">
                <div className="account-avatar w-40 h-40 border rounded-full overflow-hidden">
                    <img src={accountDetails?.avatar} alt={accountDetails?.username} />
                </div>
                <div className="account-details">
                    <h1 className="text-3xl font-bold">{accountDetails?.username}</h1>
                    <p className="text-md">{accountDetails?.email}</p>
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