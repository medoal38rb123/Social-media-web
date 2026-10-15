import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookmarksPosts, savePost } from "./SavedPosts.api";
import { Link } from "react-router";
import AppButton from "../../Shared Components/App button/AppButton";
import toast from "react-hot-toast";

function SavedPosts() {
  const { data: bookmarkPosts } = useQuery({
    queryKey: ["Bookmarks"],
    queryFn: getBookmarksPosts,
  });

  const queryClient = useQueryClient();

  const { mutate: unsavePost, isPending } = useMutation({
    mutationFn: savePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Bookmarks"],
      });

      toast.success("Post unsaved");
    },
    onError: () => {
      toast.error("Failed to unsave post");
    },
  });

  return (
    <>
      <div className="text-2xl font-bold mb-8">Saved posts</div>
      {bookmarkPosts && bookmarkPosts.length > 0 ?(
        <div className="flex flex-col gap-4">
          {bookmarkPosts?.map((e) => (
            <div key={e._id} className="bg-white dark:bg-[#252728] p-3 pb-4 rounded-xl shadow-sm">
              <div className="flex gap-4">
                <Link to={`/postdetails/${e._id}`}>
                  <div className="w-36 h-36 rounded-xl overflow-hidden hover:brightness-95">
                    <img
                      src={e.image ? `${e.image}` : `${e.user.photo}`}
                      alt={!e.image ? `${e.user.name}` : "#"}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </Link>
                <div className="flex flex-col items-start justify-between flex-1 min-w-0">
                  <Link to={`/postdetails/${e._id}`}>
                    <p className="font-medium text-xl hover:underline">
                      {e.body}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link to={`/userprofile/${e.user._id}`}>
                      <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full overflow-hidden ">
                        <img src={e.user.photo} alt={e.user.name} className="w-full h-full object-cover"/>
                      </div>
                    </Link>
                    <span className="text-gray-500 text-sm xl:text-lg dark:text-[#c5c8cb]">
                      Saved from{" "}
                      <Link to={`/postdetails/${e._id}`}>
                        <span className="text-black dark:text-white font-medium cursor-pointer hover:underline">
                          {e.user.name}'s post
                        </span>
                      </Link>
                    </span>
                  </div>
                  <div className="flex justify-end w-full">
                    <AppButton
                      onClick={() => unsavePost(e._id)}
                      isDisabled={isPending}
                      className="bg-gray-200 dark:bg-[#414344] dark:hover:brightness-105 dark:text-white hover:bg-gray-300 transition-all duration-100 text-black rounded-lg me-3 disabled:opacity-50"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                      Unsave
                    </AppButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white py-8 rounded-xl flex items-center justify-center font-bold text-xl text-gray-500 shadow-sm">
          <p>You do not have any saved posts.</p>
        </div>
      )}
    </>
  );
}

export default SavedPosts;
