import { Form } from "@heroui/react";
import { Image, Send2 } from "iconsax-reactjs";
import { useContext, useRef, useState } from "react";
import { authContext } from "../../Context/AuthContext/AuthContextProvider";
import { useForm } from "react-hook-form";
import AppButton from "../../Shared Components/App button/AppButton";
import type { CreateCommentFormData } from "./CreateComment.interface";
import toast from "react-hot-toast";
import { getCreatedCommentData } from "./CreateComment.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateComment({ postId }: { postId: string }) {
  const { currentUser } = useContext(authContext);
  const inputPhotoFile = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch } =
    useForm<CreateCommentFormData>({
      defaultValues: {
        content: "",
        image: null,
      },
    });

  const content = watch("content");

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (formData: FormData) => getCreatedCommentData(postId, formData),
    onSuccess: () => {
      reset();
      deleteImg();

      queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["PostDetails", postId] });
      queryClient.invalidateQueries({ queryKey: ["AllPosts"] });
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  }

  function onSubmit(data: CreateCommentFormData) {
    const file = inputPhotoFile.current?.files?.[0];

    if (!data.content.trim() && !file) return;

    const dataForm = new FormData();
    dataForm.append("content", data.content);
    if (file) {
      dataForm.append("image", file);
    }

    addComment(dataForm);
  }

  function deleteImg() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);

    if (inputPhotoFile.current) {
      inputPhotoFile.current.value = "";
    }
  }

  return (
    <>
      <div className="p-4 border-t flex items-start gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={currentUser?.photo}
            alt="#"
            className="w-full h-full object-cover"
          />
        </div>
        <Form
          className="flex w-80 flex-col gap-3 rounded-xl  flex-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="bg-[#F0F2F5] dark:bg-[#333334] relative rounded-2xl py-1 px-3">
            <div
              onClick={() => inputPhotoFile.current?.click()}
              className="text-gray-400 top-3 inset-e-2 w-8 h-8 dark:text-[#e2e5e9] dark:hover:bg-white/10 rounded-full flex items-center justify-center absolute hover:bg-gray-300/80 transition-all duration-300 cursor-pointer"
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
              className="shadow-none focus:outline-0 resize-none me-8 scrollbar-none placeholder:dark:text-[#e2e5e9]"
              placeholder={`Comment as ${currentUser?.name}`}
            />
            <div className="flex items-center justify-end pb-3">
              <AppButton
                isDisabled={isPending || (!content?.trim() && !imagePreview)}
                type="submit"
                className="text-main-color cursor-pointer bg-[#F0F2F5] dark:bg-[] dark:hover:bg-white/10 dark:bg-[#3B3D3E] hover:bg-[#D7DAE1] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 translate-y-2 translate-x-1"
              >
                <Send2 variant="Bold" className="scale-125" />
              </AppButton>
            </div>
          </div>
          {imagePreview && (
            <div className="w-40 h-40 overflow-hidden rounded-2xl relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div
                onClick={deleteImg}
                className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black text-gray-600 transition-all duration-300 absolute top-3 inset-e-3"
              >
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
          )}
        </Form>
      </div>
    </>
  );
}

export default CreateComment;