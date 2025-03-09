/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoCard from "@/components/VideoCard";
import { useToast } from "@/hooks/use-toast";
import { UserSchema } from "@/schemas";
import { VideoSchema } from "@/schemas";
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
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const currentUser = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    setIsLoading(true);
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
      setIsLoading(true);
      try {
        if (accountDetails?._id) {
          await fetchAccountVideos();
          await handleSubscribersCount();
          await handleIsSubscribed();
        }
      } catch (error) {
        const errorMessage = geterrorMessage((error as any)?.response?.data);
        toast({
          title: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [accountDetails]);
  const fetchAccountVideos = async () => {
    const accountVideosResponse = await axiosInstance.get(
      `/videos?sortBy=createdAt&sortType=desc&userId=${accountDetails?._id}`
    );
    setAccountVideos(accountVideosResponse?.data?.data?.docs);
  };
  const handleSubscribersCount = async () => {
    const subscribersResponse = await axiosInstance.get(
      `/subscriptions/subscribers-count/${accountDetails?._id}`
    );
    setSubscribersCount(subscribersResponse?.data?.data);
    console.log("Subscribers Count", subscribersResponse?.data?.data);
  };
  const handleIsSubscribed = async () => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/subscribers/${accountDetails?._id}`
      );
      console.log("Subscribers Data", response.data.data);
      const subscribersData = response.data.data;
      if (
        subscribersData.find(
          (subscriberDetails: any) =>
            subscriberDetails.subscriber._id === currentUser?._id
        )
      ) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    }
  };
  const handleSubscribe = async () => {
    try {
      const response = await axiosInstance.post(
        `/subscriptions/toggle/${accountDetails?._id}`
      );
      console.log("Subscribe Response", response.data.data);
      if (isSubscribed) {
        setIsSubscribed(false);
        setSubscribersCount((prev) => prev - 1);
      } else {
        setIsSubscribed(true);
        setSubscribersCount((prev) => prev + 1);
      }

      if (response.data.statusCode === 201) {
        setIsSubscribed(true);
        handleSubscribersCount();
      }
      if (response.data.statusCode === 200) {
        setIsSubscribed(false);
        handleSubscribersCount();
      }
    } catch (error) {
      const errorMessage = geterrorMessage((error as any).response.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }
  return isAccountFound ? (
    <div>
      <div className="account-header w-full py-4 px-10 gap-10 text-primary">
        <div className="account-coverImage w-full h-40 bg-blue-500 rounded-lg overflow-hidden">
          <img
            src={accountDetails?.coverImage}
            alt={accountDetails?.username}
          />
        </div>
        <div className="flex items-center gap-10 py-4 px-10">
          <div className="account-avatar w-40 border rounded-full overflow-hidden">
            <img src={accountDetails?.avatar} alt={accountDetails?.username} />
          </div>
          <div className="account-details">
            <h1 className="text-3xl font-bold">{accountDetails?.username}</h1>
            <p className="text-md">{accountDetails?.email}</p>
            <p className="text-md">{subscribersCount} subscribers</p>
            {currentUser && currentUser._id !== accountDetails?._id && (
              <Button
                variant={"outline"}
                className="my-2 dark:text-white"
                onClick={handleSubscribe}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            )}
            {isOwner && (
              <div className="account-actions my-4">
                <Button
                  variant="outline"
                  className="outline-blue-600 mx-2"
                  onClick={() => navigate("/edit-profile")}
                  size="sm"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="outline-blue-600 mx-2"
                  size="sm"
                >
                  Manage Videos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator />
      <h2 className="px-10 py-4 text-3xl font-bold text-primary">Videos</h2>
      <div className="account-videos w-full py-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-11/12 mx-auto">
          {accountVideos.length > 0 &&
            accountVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
        </div>
      </div>
    </div>
  ) : (
    "Account not found"
  );
}

export default Account;
