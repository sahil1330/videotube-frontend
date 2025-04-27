import { ICommunityPost, UserSchema } from "@/schemas";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import geterrorMessage from "@/utils/errorMessage";

function CommunityTab({ user }: { user: UserSchema }) {
  const [communityPosts, setCommunityPosts] = useState<ICommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchCommunityPosts = async () => {
        console.log("User ID", user._id);
        const response = await axiosInstance.get(`/tweets/user/${user._id}`);
        console.log("Community Posts", response.data.data);
        setCommunityPosts(response.data.data);
      };
      (async () => {
        await fetchCommunityPosts();
      })();
    } catch (error) {
      const errorMessage = geterrorMessage(error as never);
      console.error("Error fetching community posts:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user._id]);

  const handleEdit = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    console.log("Delete post with ID:", postId);
    try {
      const response = await axiosInstance.delete(`/tweets/${postId}`);
      console.log("Post deleted successfully", response.data.message);
      setCommunityPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return !isLoading ? (
    <div className="flex flex-1 flex-col gap-4 p-2 md:p-4 pt-0">
      {communityPosts.length > 0 ? (
        <div>
          {communityPosts.map((post) => (
            <div
              key={post._id}
              className="flex my-6 gap-2 p-4 border w-full md:w-3/4 border-white"
            >
              <div className="userDetails flex gap-2">
                <Avatar className="md:h-[70px] md:w-[70px] h-[60px] w-[60px] aspect-square">
                  <AvatarImage
                    src={user.avatar}
                    alt={user.username}
                    className="rounded-full"
                  />
                  <AvatarFallback>{user.username as string}</AvatarFallback>
                </Avatar>
              </div>
              <div className="content mx-4 flex flex-col gap-2 ">
                <p className="flex gap-2 items-center">
                  <h1 className="text-xl font-bold">{user.username}</h1>{" "}
                  <p className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </p>
                <p className="text-secondary-foreground">{post.content}</p>
                {post.contentImage && (
                  <img
                    src={post.contentImage}
                    alt="Community Post"
                    className="md:w-3/4 max-w-full h-auto rounded-lg"
                  />
                )}
                {/* <div className="enganements">
                  <p className="text-gray-500 text-sm">
                     Likes
                  </p>
                  <p className="text-gray-500 text-sm">
                     Comments
                  </p>
                </div> */}
              </div>

              <span className="text-sm text-gray-500">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>
                      <MoreVertical className="text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="text-gray-500">
                      <Button
                        variant={"outline"}
                        className="w-full text-left"
                        onClick={() => handleEdit(post._id)}
                      >
                        Edit
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-gray-500">
                      <Button
                        variant={"destructive"}
                        className="w-full text-left"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </Button>
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg">No Community Posts Available</p>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center">
      <Loader2 className="animate-spin" size={24} />
    </div>
  );
}

export default CommunityTab;
