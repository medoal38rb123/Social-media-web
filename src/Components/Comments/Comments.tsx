import { Dislike, Image, Like1, Send2 } from "iconsax-reactjs";
import type { TopCommentType } from "../../Pages/Posts/Posts.interface";
import { useContext, useRef, useState } from "react";
import { authContext } from "../../Context/AuthContext/AuthContextProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LikeComment } from "../Likes/Likes.api";
import { Link, useLocation } from "react-router";
import {
  createReply,
  deleteComment,
  editComment,
  getCommentReplies,
} from "./Comments.api";
import { useForm } from "react-hook-form";
import AppButton from "../../Shared Components/App button/AppButton";
import type { CreateReplyFormData } from "./Comments.interface";
import toast from "react-hot-toast";

function Comments({
  comment,
  postId,
  userId,
}: {
  comment: TopCommentType;
  postId: string;
  userId: string;
}) {
  const { currentUser } = useContext(authContext);
  const [hideCommentMenu, setHideCommentMenu] = useState<boolean>(true);
  const [deslikeComment, setDeslikeComment] = useState<boolean>(false);
  const [dislikedReplies, setDislikedReplies] = useState<string[]>([]);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [replyOnComment, setReplyOnComment] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputPhotoFile = useRef<HTMLInputElement | null>(null);

  const myQuery = useQueryClient();
  const {
    commentCreator: { name, photo, _id: commentCreatorId },
    image,
    content,
    _id,
    likes,
  } = comment;

  const location = useLocation();

  const IpostDetails = location.pathname.startsWith("/postdetails");

  const isLiked = !!currentUser && likes.includes(currentUser._id);

  const { mutate: createReplyMutation, isPending } = useMutation({
    mutationFn: createReply,
    onSuccess: () => {
      myQuery.invalidateQueries({ queryKey: ["PostDetails", postId] });
      myQuery.invalidateQueries({ queryKey: ["Comments", postId] });
      myQuery.invalidateQueries({ queryKey: ["commentReplys", _id, postId] });
    },
  });

  const { mutate: editCommentMutation, isPending: isEditPending } = useMutation(
    {
      mutationFn: editComment,
      onSuccess: () => {
        myQuery.invalidateQueries({ queryKey: ["Comments", postId] });
        myQuery.invalidateQueries({ queryKey: ["PostDetails", postId] });
        toast.success("Comment updated");
      },
      onError: () => toast.error("Failed to update comment"),
    },
  );

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  }

  function deleteImg() {
    setImagePreview(null);

    if (inputPhotoFile.current) {
      inputPhotoFile.current.value = "";
    }
  }

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<CreateReplyFormData>({
      defaultValues: {
        content: "",
        image: null,
      },
    });

  const replyContent = watch("content");

  function startEdit() {
    deleteImg();
    setIsEditing(true);
    setReplyOnComment(true);
    setValue("content", content ?? "");
    setImagePreview(image ?? null);
  }

  function startReply() {
    deleteImg();
    setIsEditing(false);
    setReplyOnComment(true);
    setValue("content", `@${name} `);
  }

  function closeForm() {
    reset();
    deleteImg();
    setReplyOnComment(false);
    setIsEditing(false);
  }

  function onSubmit(data: CreateReplyFormData) {
    const file = inputPhotoFile.current?.files?.[0];

    if (!data.content.trim() && !file && !imagePreview) return;

    const dataForm = new FormData();
    dataForm.append("content", data.content);

    if (file) {
      dataForm.append("image", file);
    }

    if (isEditing) {
      editCommentMutation({ postId, commentId: _id, data: dataForm });
    } else {
      createReplyMutation({ postId, commentId: _id, data: dataForm });
    }

    closeForm();
  }

  function handleDeslike() {
    if (isLiked) {
      if (isLiking) return;
      setDeslikeComment(true);
      toggleLike({ postId, commentId: _id });
    } else {
      setDeslikeComment(!deslikeComment);
    }
  }

  function handleReplyLike(replyId: string) {
    if (isLiking) return;
    setDislikedReplies((prev) => prev.filter((id) => id !== replyId));
    toggleLike({ postId, commentId: replyId });
  }

  function handleReplyDeslike(replyId: string, replyIsLiked: boolean) {
    if (replyIsLiked) {
      if (isLiking) return;
      setDislikedReplies((prev) => [...prev, replyId]);
      toggleLike({ postId, commentId: replyId });
    } else {
      setDislikedReplies((prev) =>
        prev.includes(replyId)
          ? prev.filter((id) => id !== replyId)
          : [...prev, replyId],
      );
    }
  }

  const { data: commentReplys } = useQuery({
    queryKey: ["commentReplys", _id, postId],
    queryFn: () => getCommentReplies({ commentId: _id, postId }),
  });

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: LikeComment,
    onSuccess: (liked) => {
      if (liked) setDeslikeComment(false);
      myQuery.invalidateQueries({ queryKey: ["Comments", postId] });
      myQuery.invalidateQueries({ queryKey: ["commentReplys", _id, postId] });
      myQuery.invalidateQueries({ queryKey: ["UserPosts", userId] });
      myQuery.invalidateQueries({ queryKey: ["AllPosts"] });
      myQuery.invalidateQueries({ queryKey: ["PostDetails", postId] });
    },
  });

  const { mutate: deleteCommentMutaion } = useMutation({
    mutationFn: deleteComment,

    onSuccess: () => {
      myQuery.invalidateQueries({ queryKey: ["Comments", postId] });
      myQuery.invalidateQueries({ queryKey: ["PostDetails", postId] });
    },
  });

  return (
    <>
      <div className={`px-3 py-2`}>
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/userprofile/${commentCreatorId}`}>
            <div className="w-10 h-10 overflow-hidden rounded-full cursor-pointer hover:brightness-85 transition-all duration-300">
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div className="flex flex-col">
            <Link to={`/userprofile/${commentCreatorId}`}>
              <span className="text-sm font-medium cursor-pointer hover:underline">
                {name}
              </span>
            </Link>
            <div>{content && <span className="mb-2">{content}</span>}</div>
            <div className="flex items-center gap-3 text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                {likes.length > 0 && <span>{likes.length}</span>}
                <Like1
                  onClick={() =>
                    !isLiking && toggleLike({ postId, commentId: _id })
                  }
                  size="18"
                  variant={isLiked ? "Bold" : "Linear"}
                  className={`${isLiked ? "text-seconed-main-color" : ""} cursor-pointer dark:text-[#e2e5e9]`}
                />
              </div>
              <Dislike
                onClick={handleDeslike}
                size="18"
                variant={deslikeComment ? "Bold" : "Linear"}
                className="cursor-pointer dark:text-[#e2e5e9]"
              />
              <span
                onClick={startReply}
                className="text-sm font-medium cursor-pointer hover:underline dark:text-[#e2e5e9]"
              >
                Reply
              </span>
              {currentUser?._id === commentCreatorId && (
                <div
                  onClick={() => setHideCommentMenu(!hideCommentMenu)}
                  className="relative cursor-pointer"
                >
                  <i className="fa-solid fa-ellipsis mt-1 dark:text-[#e2e5e9]"></i>
                  <div
                    className={`bg-white dark:bg-[#252728] rounded-xl shadow-lg text-sm absolute top-6 p-2 w-50 ${hideCommentMenu && "hidden"}`}
                  >
                    <div
                      onClick={startEdit}
                      className="flex items-center gap-3 rounded-xl dark:hover:bg-white/10 hover:bg-gray-100 font-medium mb-1 p-2"
                    >
                      <i className="fa-solid fa-pen dark:text-[#e2e5e9]"></i>
                      <span className="dark:text-[#e2e5e9]">Edit comment</span>
                    </div>
                    <div
                      onClick={() =>
                        deleteCommentMutaion({ postId, commentId: _id })
                      }
                      className="flex items-center gap-3 rounded-xl dark:hover:bg-white/10 hover:bg-gray-100 font-medium text-red-500 p-2"
                    >
                      <i className="fa-solid fa-trash"></i>
                      <span>Delete comment</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="w-40 h-40 overflow-hidden rounded-2xl border ms-12">
            <img src={image} alt="#" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      {(commentReplys?.length ?? 0) > 0 && IpostDetails && (
        <div
          onClick={() => setShowReplies(!showReplies)}
          className="font-medium dark:text-[#e2e5e9] text-gray-600 text-sm cursor-pointer hover:underline ps-16 mb-2"
        >
          {showReplies ? "Hide" : "View"} {commentReplys?.length}{" "}
          {commentReplys?.length === 1 ? "reply" : "replies"}
        </div>
      )}
      {commentReplys?.length !== 0 &&
        IpostDetails &&
        showReplies &&
        commentReplys?.map((e) => {
          const replyIsLiked = !!currentUser && e.likes.includes(currentUser._id);
          const replyIsDisliked = dislikedReplies.includes(e._id);

          return (
            <div key={e._id} className="ps-12">
              <div className="flex items-center gap-3 mb-3">
                <Link to={`/userprofile/${e.commentCreator._id}`}>
                  <div className="w-8 h-8 overflow-hidden rounded-full cursor-pointer hover:brightness-85 transition-all duration-300">
                    <img
                      src={e.commentCreator.photo}
                      alt={e.commentCreator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex flex-col">
                  <Link to={`/userprofile/${e.commentCreator._id}`}>
                    <span className="text-sm font-medium cursor-pointer hover:underline">
                      {e.commentCreator.name}
                    </span>
                  </Link>
                  <div>
                    {e.content && (
                      <p className="mb-2">
                        <Link to={`/userprofile/${commentCreatorId}`}>
                          <span className="text-blue-600 font-medium hover:underline me-1.5">
                            {name}
                          </span>
                        </Link>
                        {e.content}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 mt-1">
                    <div className="flex items-center gap-1 dark:text-[#e2e5e9]">
                      {e.likes.length > 0 && <span>{e.likes.length}</span>}
                      <Like1
                        onClick={() => handleReplyLike(e._id)}
                        size="18"
                        variant={replyIsLiked ? "Bold" : "Linear"}
                        className={`${replyIsLiked ? "text-seconed-main-color" : ""} cursor-pointer dark:text-[#e2e5e9]`}
                      />
                    </div>
                    <Dislike
                      onClick={() => handleReplyDeslike(e._id, replyIsLiked)}
                      size="18"
                      variant={replyIsDisliked ? "Bold" : "Linear"}
                      className="cursor-pointer dark:text-[#e2e5e9]"
                    />
                  </div>
                </div>
              </div>
              {e.image && (
                <div className="w-30 h-30 overflow-hidden rounded-2xl border ms-12">
                  <img
                    src={e.image}
                    alt="#"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
      {replyOnComment && (
        <div className="p-4 ps-12 flex items-start gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img
              src={currentUser?.photo}
              alt="#"
              className="w-full h-full object-cover"
            />
          </div>
          <form
            className="flex w-80 flex-col gap-3 rounded-xl  flex-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="bg-[#F0F2F5] dark:bg-[#333334] relative rounded-2xl py-1 px-3">
              <div
                onClick={() => inputPhotoFile.current?.click()}
                className="text-gray-400 top-3 inset-e-2 w-8 h-8 rounded-full flex items-center dark:hover:bg-white/10 justify-center absolute hover:bg-gray-300/80 transition-all duration-300 cursor-pointer"
              >
                <Image size="20" variant="Bold" />
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                ref={inputPhotoFile}
              />
              <textarea
                {...register("content")}
                className="shadow-none focus:outline-0 resize-none me-8 scrollbar-none placeholder:dark:dark:text-[#e2e5e9]"
                placeholder={
                  isEditing ? "Edit your comment" : `Reply as ${currentUser?.name}`
                }
              />
              <div className="flex items-center justify-end pb-3">
                <AppButton
                  isDisabled={
                    isPending ||
                    isEditPending ||
                    (!replyContent?.trim() && !imagePreview)
                  }
                  type="submit"
                  className="text-main-color cursor-pointer bg-[#F0F2F5] dark:bg-[#333334] dark:hover:bg-white/10 hover:bg-[#D7DAE1] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 translate-y-2 translate-x-1"
                >
                  <Send2 variant="Bold" className="scale-125" />
                </AppButton>
              </div>
            </div>
            {imagePreview && (
              <div className="w-30 h-30 overflow-hidden rounded-2xl relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div
                  onClick={deleteImg}
                  className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:dark:bg-gray-400 hover:bg-gray-100 hover:text-black text-gray-600 transition-all duration-300 absolute top-3 inset-e-3"
                >
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </div>
            )}
            <span
              onClick={closeForm}
              className="text-xs text-gray-500 font-medium cursor-pointer hover:underline dark:text-[#e2e5e9]"
            >
              {isEditing ? "Cancel editing" : "Cancel"}
            </span>
          </form>
        </div>
      )}
    </>
  );
}

export default Comments;