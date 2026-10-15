import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { getAllPosts, getHomeFeed } from "./Posts.api";
import PostsLoading from "../../Components/PostsLoading";
import PostCard from "../../Components/PostCard";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import AppButton from "../../Shared Components/App button/AppButton";
import { authContext } from "../../Context/AuthContext/AuthContextProvider";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import type { CreatePostFormData } from "../CreatePost/CreatePost.interface";
import toast from "react-hot-toast";
import { getCreatedPostData } from "../CreatePost/CreatePost.api";

function Posts() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [discoverMode, setDiscoverMode] = useState<boolean>(false);
  const { currentUser } = useContext(authContext);
  const [createPost, setCreatPost] = useState<boolean>(false);
  const inputPhotoFile = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    defaultValues: { body: "", photo: null },
  });

  function closeCreate() {
    setCreatPost(false);
    setImagePreview(null);
    reset();
    if (inputPhotoFile.current) inputPhotoFile.current.value = "";
  }

  const { mutate: createPostMutation, isPending: isCreating } = useMutation({
    mutationFn: getCreatedPostData,

    onSuccess: async () => {
      toast.success("Post created successfully");
      closeCreate();

      await queryClient.invalidateQueries({ queryKey: ["HomeFeed"] });
      await queryClient.invalidateQueries({ queryKey: ["AllPosts"] });
      queryClient.invalidateQueries({ queryKey: ["UserPosts"] });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: CreatePostFormData) {
    const file = inputPhotoFile.current?.files?.[0];

    const formData = new FormData();
    formData.append("body", data.body);
    if (file) formData.append("image", file);

    createPostMutation(formData);
  }

  function deleteImg() {
    setImagePreview(null);

    if (inputPhotoFile.current) {
      inputPhotoFile.current.value = "";
    }
  }

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: discoverMode ? ["AllPosts"] : ["HomeFeed"],

    queryFn: ({ pageParam }) =>
      discoverMode ? getAllPosts(pageParam) : getHomeFeed(pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) =>
      allPages.length < lastPage.pages ? allPages.length + 1 : undefined,

    staleTime: 1000 * 60 * 5,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.post) ?? [],
    [data],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <PostsLoading />;
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load posts.</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center mb-4">
        <div className="mb-5 dark:bg-[#252728] bg-white rounded-2xl p-3 w-full max-w-2xl shadow-sm">
          <div className="flex gap-3 items-center">
            <Link to={`/userprofile/${currentUser?._id}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden hover:brightness-90">
                <img
                  src={currentUser?.photo}
                  alt={currentUser?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div
              onClick={(_) => setCreatPost(true)}
              className="py-2 px-3 rounded-2xl bg-gray-100 dark:hover:brightness-105 dark:bg-[#333334] hover:bg-gray-200 transition-all duration-150 cursor-pointer flex-1"
            >
              <p className="text-lg text-gray-500 dark:text-[#e2e5e9]">
                What's in your mind, {currentUser?.name?.split(" ")[0]}?
              </p>
            </div>
          </div>
        </div>
        {createPost && (
          <div className="inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 overflow-y-auto scrollbar-none">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-80 flex-col gap-4 min-w-3xl rounded-3xl dark:bg-[#252728] bg-white p-8 shadow-xl"
            >
              <div className="text-center text-main-color text-4xl font-semibold mb-3">
                <h1>Create post</h1>
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
                className="bg-field shadow-none placeholder:text-2xl focus:border-0 dark:bg-[#252728] focus:outline-0 min-h-40 text-xl font-medium resize-none placeholder:dark:text-[#e2e5e9]"
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
                  onClick={closeCreate}
                  className="text-gray-500 hover:underline cursor-pointer dark:text-[#e2e5e9]"
                >
                  Cancel
                </button>
              </div>
              <AppButton
                isDisabled={isCreating}
                className="w-full bg-main-color"
                type="submit"
              >
                {isCreating ? "Creating..." : "Create"}
              </AppButton>
            </form>
          </div>
        )}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10" />

      {isFetchingNextPage && <PostsLoading />}

      {!hasNextPage && posts.length > 0 && !discoverMode && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <p className="text-center text-gray-500">You're all caught up!</p>

          <AppButton
            onClick={() => setDiscoverMode(true)}
            className="rounded-lg bg-seconed-main-color px-5 py-2 text-white transition duration-100 hover:brightness-95"
          >
            Discover More
          </AppButton>
        </div>
      )}

      {!hasNextPage && discoverMode && posts.length > 0 && (
        <p className="text-center text-gray-500 mb-4">
          You've explored all posts!
        </p>
      )}

      {!hasNextPage && posts.length === 0 && !discoverMode && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <p className="text-center text-gray-500">Your feed is empty.</p>

          <button
            onClick={() => setDiscoverMode(true)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Discover Posts
          </button>
        </div>
      )}

      {!hasNextPage && posts.length === 0 && discoverMode && (
        <p className="text-center text-gray-500 mb-4">
          No posts available to discover.
        </p>
      )}
    </>
  );
}

export default Posts;
