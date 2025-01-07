import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import geterrorMessage from "@/utils/errorMessage";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

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

            <div className="account-body w-full px-10 py-4">
                <h1 className="text-2xl font-bold">Account Details</h1>
                <div className="account-details">
                    <p className="text-md">Full Name: {userDetails?.fullName}</p>
                    <p className="text-md">Email: {userDetails?.email}</p>
                </div>
            </div>
        </div>
    )
}

export default Account