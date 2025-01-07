import { Separator } from "@/components/ui/separator";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { set } from "zod";

function Account() {
    const { slug } = useParams();
    const username = slug;
    const [isOwner, setIsOwner] = useState(false);
    const [isAccountFound, setIsAccountFound] = useState(true);
    const { toast } = useToast();
    // const navigate = useNavigate(); 
    // console.log("username: ", username);
    const userDetailsRef = useRef(useSelector((state: any) => state.auth.user));
    const userDetails = userDetailsRef.current;
    const [accountVideos, setAccountVideos] = useState([]);
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
                    const accountVideosResponse = await axiosInstance.get(`/videos?sortBy=createdAt&sortType=desc&userId=${response.data._id}`);
                    setAccountVideos(accountVideosResponse?.data?.data?.docs);

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
    }, [userDetails, username, toast]);
    return (
        <div>
            <div className="account-header flex items-center w-full py-4 px-10 gap-10 text-blue-600">
                <div className="account-avatar w-40 h-40 border rounded-full overflow-hidden">
                    <img src={userDetails?.avatar} alt={userDetails?.username} />
                </div>
                <div className="account-details">
                    <h1 className="text-3xl font-bold">{userDetails?.username}</h1>
                    <p className="text-md">{userDetails?.email}</p>
                </div>
            </div>
            <Separator />
            <h2 className="px-10 py-4 text-3xl font-bold text-blue-500">Videos</h2>
            <div className="account-videos w-full px-10 py-4">
                {isAccountFound ? (
                    <div className="flex flex-wrap gap-4">
                    </div>
                ) : (
                    <h3 className="text-xl text-red-500">Account not found</h3>
                )}
            </div>
        </div>
    )
}

export default Account