import { getPostDetails } from "./PostDetails.api";
import { useParams } from "react-router";
import PostCard from "../../Components/PostCard";
import PostsLoading from "../../Components/PostsLoading";
import { useQuery } from "@tanstack/react-query";

function PostDetails() {
  const { postId } = useParams<{ postId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["PostDetails", postId],
    queryFn: () => getPostDetails(postId!),
    enabled: !!postId,
  });

  if (isLoading) {
    return <PostsLoading />;
  }

  if (isError) {
    return <p>Failed to load post details.</p>;
  }

  return <>{data && <PostCard post={data} postDetails />}</>;
}

export default PostDetails;
