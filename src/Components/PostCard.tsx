import { Like1, MessageText, Send2 } from "iconsax-reactjs";
import type { Post, UbdatePostFormData } from "../Pages/Posts/Posts.interface";
import { Link, useNavigate } from "react-router";
import { useContext, useRef, useState } from "react";
import { getAllComments } from "./Comments/Comments.api";
import Comments from "./Comments/Comments";
import CreateComment from "./CreateComment/CreateComment";
import { getPostLikes, LikePost } from "./Likes/Likes.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePost, ubdatePost } from "../Pages/Posts/Posts.api";
import { authContext } from "../Context/AuthContext/AuthContextProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import AppButton from "../Shared Components/App button/AppButton";
import {
  getBookmarksPosts,
  savePost,
} from "../Pages/SavedPosts/SavedPosts.api";
import { sharePostApi } from "./SharePost/SharePost.api";

function PostCard({
  post,
  postDetails,
  // userProfile,
  myProfile,
}: {
  post: Post;
  postDetails?: boolean;
  userProfile?: boolean;
  myProfile?: boolean;
}) {
  const {
    createdAt,
    commentsCount,
    likesCount,
    sharesCount,
    user: { name, photo, _id: userId },
    body,
    image,
    topComment,
    _id,
  } = post;

  const [more, setMore] = useState<boolean>(true);
  const { currentUser } = useContext(authContext);
  const [isUbdatePost, setIsUbdatePost] = useState<boolean>(false);
  const profileLink =
    currentUser?._id === userId ? "/myprofile" : `/userProfile/${userId}`;

  const [openPostLikes, setOpenPostLikes] = useState<boolean>(true);
  const [sharePost, setSharePost] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const inputPhotoFile = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UbdatePostFormData>({
    defaultValues: {
      body: body ?? "",
    },
  });

  const {
    register: registerShare,
    handleSubmit: handleSubmitShare,
    reset: resetShare,
  } = useForm<{ body: string }>({
    defaultValues: { body: "" },
  });

  function openEdit() {
    reset({ body: body ?? "" });
    setImagePreview(image ?? null);
    setImageFile(null);
    setMore(true);
    setIsUbdatePost(true);
  }

  function closeEdit() {
    setIsUbdatePost(false);
    setImageFile(null);
    setImagePreview(null);
  }

  function openShare() {
    resetShare({ body: "" });
    setMore(true);
    setSharePost(true);
  }

  function closeShare() {
    setSharePost(false);
    resetShare({ body: "" });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function deleteImg() {
    setImagePreview(null);
    setImageFile(null);

    if (inputPhotoFile.current) {
      inputPhotoFile.current.value = "";
    }
  }

  const { data: allComments } = useQuery({
    queryKey: ["Comments", _id],
    queryFn: () => getAllComments(_id),
    enabled: !!postDetails,
  });

  const { data: postLikes } = useQuery({
    queryKey: ["PostLikes", _id],
    queryFn: () => getPostLikes(_id),
  });

  const isLike =
    !!currentUser &&
    (postLikes?.some((u) => u._id === currentUser._id) ?? false);

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => LikePost(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PostDetails", _id] });
      queryClient.invalidateQueries({ queryKey: ["AllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["PostLikes", _id] });
      queryClient.invalidateQueries({ queryKey: ["HomeFeed"] });
    },
  });

  const { mutate: deletePostMutation, isPending } = useMutation({
    mutationFn: deletePost,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UserPosts", userId] });
      queryClient.invalidateQueries({ queryKey: ["AllPosts"] });
    },
  });

  const { mutate: ubdatePostMutation, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) =>
      ubdatePost({ postId: _id, data: formData }),

    onSuccess: () => {
      toast.success("Post updated successfully");

      closeEdit();

      queryClient.invalidateQueries({ queryKey: ["UserPosts", userId] });
      queryClient.invalidateQueries({ queryKey: ["AllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["PostDetails", _id] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: UbdatePostFormData) {
    const formData = new FormData();
    formData.append("body", values.body);
    if (imageFile) formData.append("image", imageFile);

    ubdatePostMutation(formData);
  }

  const { mutate: savePostMutation } = useMutation({
    mutationFn: savePost,

    onSuccess: () => {
      toast.success(isSaved ? "Post unsaved" : "Post saved");

      queryClient.invalidateQueries({
        queryKey: ["Bookmarks"],
      });
    },
  });

  const { mutate: sharePostMutation, isPending: isSharing } = useMutation({
    mutationFn: sharePostApi,

    onSuccess: () => {
      toast.success("Post shared");
      closeShare();

      queryClient.invalidateQueries({
        queryKey: ["UserPosts", currentUser?._id],
      });
      queryClient.invalidateQueries({ queryKey: ["AllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["PostDetails", _id] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onShare(values: { body: string }) {
    const formData = new FormData();
    if (values.body.trim()) formData.append("body", values.body.trim());

    sharePostMutation({ postId: _id, data: formData });
  }

  const { data: bookmarkPosts } = useQuery({
    queryKey: ["Bookmarks"],
    queryFn: getBookmarksPosts,
  });

  const isSaved =
    bookmarkPosts?.some((savedPost) => savedPost._id === _id) ?? false;

  function getPostTime(createdAt: string) {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays <= 7) {
      return `${diffInDays}d ago`;
    }

    return createdDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <>
      <div
        className={`bg-white dark:bg-[#252728] shadow-sm rounded-2xl mx-auto w-full max-w-2xl`}
      >
        <div className="p-3 w-full border-b">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Link to={profileLink}>
                <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:brightness-85 transition-all">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <Link to={profileLink}>
                  <h3 className="font-medium cursor-pointer hover:underline transition-all duration-300">
                    {name}
                  </h3>
                </Link>
                <Link to={`/postdetails/${_id}`}>
                  <div className="cursor-pointer font-medium text-sm text-gray-500 dark:text-[#e2e5e9]">
                    <span>{getPostTime(createdAt)}</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setMore(!more)}
                className="relative w-8 h-8 rounded-full flex justify-center items-center dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300"
              >
                <i className="fa-solid fa-ellipsis text-gray-600 dark:text-[#e2e5e9]"></i>
                <div
                  className={`w-60 absolute top-10 shadow-xl p-2 dark:bg-[#252728] bg-white rounded-xl ${more && "hidden"}`}
                >
                  <div
                    onClick={() => savePostMutation(_id)}
                    className="flex items-center gap-2 dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300 p-2 rounded-lg"
                  >
                    <i
                      className={`${isSaved ? "fa-solid" : "fa-regular"} fa-bookmark`}
                    ></i>

                    <span className="font-medium">
                      {isSaved ? "Unsave post" : "Save post"}
                    </span>
                  </div>
                  <div
                    onClick={openEdit}
                    className={`flex items-center gap-2 dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300 p-2 rounded-lg ${!myProfile && "hidden"}`}
                  >
                    <i className="fa-solid fa-pen"></i>
                    <span className="font-medium">Edit post</span>
                  </div>
                  <div
                    onClick={() => deletePostMutation(_id)}
                    className={`flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 p-2 rounded-lg text-red-500 ${!myProfile && "hidden"}`}
                  >
                    <i className="fa-solid fa-trash"></i>
                    <span className="font-medium">
                      {isPending ? "Deleting..." : "Delete Post"}
                    </span>
                  </div>
                </div>
              </div>
              {postDetails && (
                <div
                  onClick={() => navigate("/")}
                  className="h-8 w-8 rounded-full flex items-center justify-center dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300"
                >
                  <i className="fa-solid fa-xmark text-gray-600 dark:text-[#e2e5e9]"></i>
                </div>
              )}
            </div>
          </div>
          {body && <p className="mb-3">{body}</p>}
          {post.isShare && post.sharedPost && (
            <div className="border rounded-xl overflow-hidden mt-3">
              <Link
                to={`/userProfile/${post.sharedPost.user._id}`}
                className="flex items-center gap-2 p-3"
              >
                <img
                  src={post.sharedPost.user.photo}
                  alt={post.sharedPost.user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />

                <span className="font-medium hover:underline">
                  {post.sharedPost.user.name}
                </span>
              </Link>

              {post.sharedPost.body && (
                <p className="px-3 pb-3">{post.sharedPost.body}</p>
              )}

              {post.sharedPost.image && (
                <Link to={`/postdetails/${post.sharedPost._id}`}>
                  <img
                    src={post.sharedPost.image}
                    alt={post.sharedPost.body ?? "Shared post"}
                    className="w-full max-h-96 object-contain"
                  />
                </Link>
              )}
            </div>
          )}
        </div>
        <Link to={`/postdetails/${_id}`}>
          {post.image && (
            <div className="min-h-0 w-full border-b">
              <img src={image} alt={body} className="w-full h-full" />
            </div>
          )}
        </Link>
        <div
          className={`flex items-center justify-between ${topComment && "border-b"}`}
        >
          <div className="flex items-center gap-2">
            <div
              onClick={() => toggleLike()}
              className="flex cursor-pointer dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300 gap-2 items-center p-3 text-gray-600"
            >
              <Like1
                size="22"
                variant={isLike ? "Bold" : "Linear"}
                className={`${isLike && "text-seconed-main-color"} dark:text-[#e2e5e9]`}
              />
              <span className="text-sm mt-0.5 dark:text-[#e2e5e9]">{likesCount}</span>
            </div>
            <Link to={`/postdetails/${_id}`}>
              <div className="flex cursor-pointer dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300 gap-2 items-center p-3 text-gray-600">
                <MessageText size="20" className="dark:text-[#e2e5e9]"/>
                <span className="text-sm mt-0.5 dark:text-[#e2e5e9]">{commentsCount}</span>
              </div>
            </Link>
            <div
              onClick={openShare}
              className="flex cursor-pointer dark:hover:bg-white/10 hover:bg-gray-100 transition-all duration-300 gap-2 items-center p-3 text-gray-600"
            >
              <Send2 size="20" className="dark:text-[#e2e5e9]"/>
              <span className="text-sm mt-0.5 dark:text-[#e2e5e9]">{sharesCount}</span>
            </div>
          </div>
          {likesCount !== 0 && (
            <div
              onClick={() => setOpenPostLikes(!openPostLikes)}
              className="flex items-center p-3 cursor-pointer"
            >
              <div className="w-6 h-6 text-[12px] rounded-full flex items-center justify-center bg-seconed-main-color text-white border-2 border-white translate-x-1">
                <i className="fa-solid fa-thumbs-up"></i>
              </div>
              <div className="w-6 h-6 text-[10px] rounded-full flex items-center justify-center bg-red-500 text-white border-2 border-white">
                <i className="fa-solid fa-heart"></i>
              </div>
            </div>
          )}

          {isUbdatePost && (
            <div className="inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 overflow-y-auto scrollbar-none">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-80 flex-col gap-4 min-w-3xl rounded-3xl dark:bg-[#252728] bg-white p-8 shadow-xl"
              >
                <div className="text-center text-main-color text-4xl font-semibold mb-3">
                  <h1>Ubdate post</h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={currentUser?.photo}
                      alt={currentUser?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{currentUser?.name}</h3>
                </div>
                <textarea
                  {...register("body")}
                  className="bg-field shadow-none placeholder:text-2xl focus:border-0 focus:outline-0 min-h-40 text-xl font-medium resize-none dark:bg-[#252728] placeholder:dark:text-[#e2e5e9]"
                  placeholder={`What's in your mind ${currentUser?.name.split(" ")[0]}`}
                />
                {errors.body && (
                  <span className="text-red-500 text-xs">
                    {errors.body?.message}
                  </span>
                )}
                {imagePreview && (
                  <div className="w-full overflow-hidden rounded-2xl relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-96 object-cover"
                    />
                    <div
                      onClick={deleteImg}
                      className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black text-gray-600 transition-all duration-300 absolute top-3 inset-e-3"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => inputPhotoFile.current?.click()}
                    className="text-xl text-gray-500 cursor-pointer w-10 h-10 rounded-xl dark:hover:bg-white/10 hover:bg-gray-100 flex items-center justify-center transition-all duration-300"
                  >
                    <i className="fa-solid fa-image dark:text-[#e2e5e9]"></i>
                  </div>
                  <input
                    onChange={handleImageChange}
                    ref={inputPhotoFile}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="text-gray-500 hover:underline cursor-pointer dark:text-[#e2e5e9]"
                  >
                    Cancel
                  </button>
                </div>
                <AppButton
                  isDisabled={isUpdating}
                  className="w-full bg-main-color"
                  type="submit"
                >
                  {isUpdating ? "Updating..." : "Ubdate"}
                </AppButton>
              </form>
            </div>
          )}

          {sharePost && (
            <div className="inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 overflow-y-auto scrollbar-none">
              <form
                onSubmit={handleSubmitShare(onShare)}
                className="flex w-80 flex-col gap-4 min-w-3xl rounded-3xl dark:bg-[#252728] bg-white p-8 shadow-xl"
              >
                <div className="text-center text-main-color text-4xl font-semibold mb-3">
                  <h1>Share post</h1>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={currentUser?.photo}
                      alt={currentUser?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{currentUser?.name}</h3>
                </div>

                <textarea
                  {...registerShare("body")}
                  className="bg-field shadow-none placeholder:text-2xl focus:border-0 focus:outline-0 min-h-24 text-xl font-medium resize-none dark:bg-[#252728] placeholder:dark:text-[#e2e5e9]"
                  placeholder="Say something about this post... (optional)"
                />

                <div className="border rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 p-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={photo}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm">{name}</span>
                  </div>
                  {body && <p className="px-3 pb-3 line-clamp-3">{body}</p>}
                  {image && (
                    <img
                      src={image}
                      alt={body}
                      className="w-full max-h-60 object-cover"
                    />
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={closeShare}
                    className="text-gray-500 hover:underline cursor-pointer dark:text-[#e2e5e9]"
                  >
                    Cancel
                  </button>
                </div>

                <AppButton
                  isDisabled={isSharing}
                  className="w-full bg-main-color"
                  type="submit"
                >
                  {isSharing ? "Sharing..." : "Share"}
                </AppButton>
              </form>
            </div>
          )}
        </div>

        <div
          className={`inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 ${openPostLikes && "hidden"}`}
        >
          <div className="bg-white dark:bg-[#252728] rounded-2xl w-150 h-100 shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-3 border-b p-2">
                <h2 className="ms-2 font-semibold text-3xl">All likes</h2>
                <div
                  onClick={() => setOpenPostLikes(!openPostLikes)}
                  className="h-10 w-10 rounded-full flex items-center justify-center dark:hover:bg-white/10 hover:bg-gray-200 transition-all duration-300"
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start gap-4 py-4 px-3 overflow-y-auto">
                {postLikes?.map((e) => (
                  <div
                    key={e._id}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-3 relative">
                      <Link to={`/userProfile/${e._id}`}>
                        <div className="w-12 h-12 rounded-full overflow-hidden hover:brightness-90 cursor-pointer">
                          <img
                            src={e.photo}
                            alt={e.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <Link to={`/userProfile/${e._id}`}>
                        <h3 className="font-medium hover:underline">
                          {e.name}
                        </h3>
                      </Link>
                      <div className="absolute -bottom-1 inset-s-7 w-5 h-5 text-[10px] rounded-full flex items-center justify-center bg-seconed-main-color text-white ">
                        <i className="fa-solid fa-thumbs-up"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {topComment && !postDetails && (
          <Comments comment={topComment} postId={_id} userId={userId} />
        )}
        <div className="max-h-100 overflow-y-scroll">
          {postDetails &&
            allComments?.map((e) => (
              <Comments key={e._id} postId={_id} userId={userId} comment={e} />
            ))}
        </div>
        <div>{postDetails && <CreateComment postId={_id} />}</div>
      </div>
    </>
  );
}

export default PostCard;
