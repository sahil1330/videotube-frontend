/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { commentSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import geterrorMessage from "@/utils/errorMessage";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ThumbsUpIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  videoId: string | undefined;
  userDetails: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
    watchHistory: string[];
  } | null;
}
function CommentSection({ videoId, userDetails }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommentsAndLikes = async () => {
      try {
        const response = await axiosInstance.get(
          `/comments/get-comments/${videoId}?page=1&limit=10`
        );
        console.log("Comments", response.data.data.docs);
        const fetchedComments = response.data.data.docs;
        setComments(fetchedComments);

        // Process each comment to get likes and user's like status
        for (const comment of fetchedComments) {
          const commentLikesResponse = await axiosInstance.get(
            `/likes/get-comment-likes/${comment._id}`
          );

          // Set the likes count in the comment object
          // Update the comment in the state
          await updateCommentLikes(comment._id, commentLikesResponse.data.data);
        }
      } catch (error) {
        const errorMessage = geterrorMessage((error as any)?.response?.data);
        toast({
          title: "Failed to load comments",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    if (videoId) {
      fetchCommentsAndLikes();
    }
  }, [videoId, toast]);
  const updateCommentLikes = async (commentId: string, likesData: any[]) => {
    const isLiked = likesData.some(
      (like) => like.likedBy._id === userDetails?._id
    );
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment, likesCount: likesData.length, isLiked }
          : comment
      )
    );
  };
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(
        `/comments/add-comment/${videoId}`,
        {
          content: values.comment,
        }
      );
      setComments((prev) => [response.data.data, ...prev]);
      form.reset();
    } catch (error: any) {
      const errorMessage = geterrorMessage(error?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    try {
      // Optimistically update the UI
      if (!isLiked) {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, isLiked: true, likesData: comment.likesData + 1 }
              : comment
          )
        );
      } else {
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, isLiked: false, likesData: comment.likesData - 1 }
              : comment
          )
        );
      }
      const response = await axiosInstance.post(
        `/likes/toggle-comment-like/${commentId}`
      );

      if (response.data.status === 201) {
        // User liked the comment
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? { ...comment, isLiked: true } : comment
          )
        );
      } else if (response.data.status === 200) {
        // User unliked the comment
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId ? { ...comment, isLiked: false } : comment
          )
        );
      }

      // Refresh the actual count from server to stay in sync
      const commentLikesResponse = await axiosInstance.get(
        `/likes/get-comment-likes/${commentId}`
      );
      await updateCommentLikes(commentId, commentLikesResponse.data.data);
    } catch (error) {
      const errorMessage = geterrorMessage((error as any)?.response?.data);
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 pt-4">
      <h2 className="text-xl">Comments</h2>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col justify-between gap-4"
          >
            <div className="flex gap-4 items-center">
              <Avatar className="h-[54px] w-[54px] aspect-square">
                <AvatarImage
                  src={userDetails?.avatar}
                  alt={userDetails?.username}
                  className="rounded-full"
                />
                <AvatarFallback>{userDetails?.fullName}</AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Textarea
                        placeholder="Add a comment ..."
                        {...field}
                        className="resize-none min-h-[20px] border border-y-2 border-x-0 border-t-0 w-full"
                        onFocusCapture={() => setIsCommentFocused(true)}
                        onBlurCapture={(e) => {
                          // Prevent blur if clicking the Comment button
                          const target = e.relatedTarget as HTMLElement | null;
                          if (
                            target &&
                            target.getAttribute("type") === "submit"
                          )
                            return;
                          setIsCommentFocused(false);
                        }}
                      />
                    </FormControl>
                    {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* {isSubmitting ? (<Button disabled className="text-white">Comment <Loader2 className="animate-spin" /></Button>) : (<Button type="submit" className="text-white">Comment</Button>)} */}
            {isCommentFocused && (
              <div className="flex justify-end gap-4">
                <Button
                  variant={"outline"}
                  onClick={() => setIsCommentFocused(false)}
                >
                  Cancel
                </Button>
                {isSubmitting ? (
                  <Button disabled className="text-white">
                    Comment <Loader2 className="animate-spin" />
                  </Button>
                ) : (
                  <Button type="submit" className="text-white">
                    Comment
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
        {/* <Input placeholder="Add a comment..." className="w-full" />
                <Button className="text-white">Comment</Button> */}
      </div>
      <div className="comments space-y-4">
        {comments?.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage
                  src={comment.owner.avatar}
                  alt={comment.owner.username}
                  className="rounded-full"
                />
                <AvatarFallback>{comment.owner.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {comment.owner.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    className="flex items-center gap-1 text-sm hover:text-gray-700"
                    onClick={() =>
                      handleCommentLike(comment._id, comment.isLiked)
                    }
                  >
                    <span>
                      {comment.isLiked ? (
                        <ThumbsUpIcon className="w-4 h-4" fill="currentColor" />
                      ) : (
                        <ThumbsUpIcon className="w-4 h-4" />
                      )}
                    </span>
                    {comment.likesCount ? (
                      <span className="text-sm text-gray-500">
                        {comment.likesCount}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">0</span>
                    )}
                  </button>
                  <button className="text-sm font-medium hover:text-gray-700">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-2 h-24 justify-center items-center">
            <h3 className="text-lg font-bold">No comments yet</h3>
            <p>Be the first to comment</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
