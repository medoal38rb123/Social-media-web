import { ArrowLeft } from "iconsax-reactjs";
import { createContext, useContext, useRef } from "react";
import toast from "react-hot-toast";
import { getMyProfile, handleChangePhoto } from "./MyProfile.api";
import { getUserData } from "../../Context/AuthContext/AuthContextProvider.api";
import type { followType } from "./MyProfile.interface";
import { authContext } from "../../Context/AuthContext/AuthContextProvider";
import { Link } from "react-router";
import PostCard from "../../Components/PostCard";
import { getUserPosts } from "../USerPosts/UserPosts.api";
import { useQuery } from "@tanstack/react-query";

export const followContext = createContext<followType>({
  isFollow: null,
  setIsFollow: () => {},
});

function MyProfile() {
  const inputPhotoFile = useRef<HTMLInputElement>(null);
  const { currentUser, setCurrentUser } = useContext(authContext);
  // const [showFollowers, setShowFollowers] = useState<boolean>(true);
  // const [showFollowing, setShowFollowing] = useState<boolean>(true);

  async function changeUserPhoto() {
    const file = inputPhotoFile.current?.files?.[0];
    if (!file) return;

    const dataForm = new FormData();
    dataForm.append("photo", file);

    toast.promise(handleChangePhoto(dataForm), {
      loading: "Please wait",
      success: (res) => {
        getUserData().then((data) => setCurrentUser(data));
        return res;
      },
      error: "Couldn't change your photo",
    });
  }

  const { data: myProfile } = useQuery({
    queryKey: ["MyProfile"],
    queryFn: getMyProfile,
  });

  const joinDate = myProfile?.createdAt
    ? new Date(myProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";
  const { data: userPosts } = useQuery({
    queryKey: ["UserPosts", currentUser?._id],
    queryFn: () => getUserPosts(currentUser!._id),
    enabled: !!currentUser?._id,
  });

  return (
    <>
      <div className="w-full h-full">
        <div className="flex items-center gap-6 ps-4 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center dark:hover:bg-white/10 hover:bg-gray-200 transition-all duration-300">
            <Link to="/">
              <ArrowLeft
                size="16"
                strokeWidth={5}
                className="text-black cursor-pointer dark:text-[#e2e5e9]"
              />
            </Link>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <h2 className="font-bold text-xl">{myProfile?.name}</h2>
            </div>
            <span className="text-gray-500 font-medium text-sm dark:text-[#e2e5e9]">
              {userPosts?.length} post
            </span>
          </div>
        </div>
        <section>
          <div className="border border-default rounded-2xl w-full overflow-hidden object-cover">
            <div className="bg-white dark:bg-[#252728]">
              <div className="h-120 relative cursor-pointer">
                <div
                  onClick={() => inputPhotoFile.current?.click()}
                  className="absolute inset-s-5 -bottom-15 rounded-full w-35 h-35 overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={myProfile?.photo}
                    alt="Medo Elaidy"
                  />
                  <input
                    onChange={changeUserPhoto}
                    type="file"
                    className="hidden"
                    ref={inputPhotoFile}
                  />
                </div>
                <a href="#">
                  <img
                    className="rounded-t-base w-full h-full object-cover"
                    src="/src/assets/leafless-tree-snowy-hill-with-cloudy-sky-background-black-white_181624-4519.avif"
                    alt=""
                  />
                </a>
              </div>
              <div className="p-4 pt-12">
                <div className="flex flex-col mt-6">
                  <div className="flex gap-2 items-center">
                    <h1 className="font-bold text-3xl">{myProfile?.name}</h1>
                  </div>
                  <span className="font-medium text-gray-500 dark:text-[#e2e5e9]">
                    @{myProfile?.username}
                  </span>
                  <div className="flex flex-col gap-2">
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-lg font-bold text-black flex items-center gap-2 dark:text-[#e2e5e9]">
                        <span>{myProfile?.followingCount}</span>
                        <span
                          // onClick={() => setShowFollowing(!showFollowing)}
                          className="font-medium text-gray-500 dark:text-[#e2e5e9]"
                        >
                          Following
                        </span>
                      </span>
                      <span className="text-lg font-bold text-black flex items-center gap-2 dark:text-[#e2e5e9]">
                        <span>{myProfile?.followersCount}</span>
                        <span
                          // onClick={() => setShowFollowers(!showFollowers)}
                          className="font-medium text-gray-500 dark:text-[#e2e5e9]"
                        >
                          Followers
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-medium dark:text-[#e2e5e9]">
                      <span>Joined at</span>
                      <p>{joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* {myProfile?.followersCount !== 0 ? (
              <div
                className={`inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 ${showFollowers && "hidden"}`}
              >
                <div className="bg-white dark:bg-[#252728] rounded-2xl w-150 h-100 shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 border-b p-2">
                      <h2 className="ms-2 font-semibold text-3xl">
                        All Followers
                      </h2>
                      <div
                        onClick={() => setShowFollowers(!showFollowers)}
                        className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 dark:hover:bg-white/10"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start gap-4 py-4 px-3 overflow-y-auto">
                      {myProfile?.followers?.map((e) => (
                        <div
                          key={e._id}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-3">
                            <Link
                              to={
                                currentUser?._id === e._id
                                  ? `/myprofile`
                                  : `/userProfile/${e._id}`
                              }
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden hover:brightness-90 cursor-pointer">
                                <img
                                  src={e.photo}
                                  alt={e.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            <Link
                              to={
                                currentUser?._id === e._id
                                  ? `/myprofile`
                                  : `/userProfile/${e._id}`
                              }
                            >
                              <h3 className="font-medium hover:underline">
                                {e.name}
                              </h3>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 ${showFollowers && "hidden"}`}
              >
                <div className="bg-white dark:bg-[#252728] rounded-2xl w-150 h-100 shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 border-b p-2">
                      <h2 className="ms-2 font-semibold text-3xl">
                        All Followers
                      </h2>
                      <div
                        onClick={() => setShowFollowers(!showFollowers)}
                        className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 dark:hover:bg-white/10"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center text-3xl mb-4 font-bold">
                      No followers
                    </div>
                  </div>
                </div>
              </div>
            )}
            {myProfile?.followingCount !== 0 ? (
              <div
                className={`inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 ${showFollowing && "hidden"}`}
              >
                <div className="bg-white dark:bg-[#252728] rounded-2xl w-150 h-100 shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 border-b p-2">
                      <h2 className="ms-2 font-semibold text-3xl">
                        All Following
                      </h2>
                      <div
                        onClick={() => setShowFollowing(!showFollowing)}
                        className="h-10 w-10 rounded-full flex items-center justify-center dark:hover:bg-white/10 hover:bg-gray-200 transition-all duration-300"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-start gap-4 py-4 px-3 overflow-y-auto">
                      {myProfile?.following?.map((e) => (
                        <div
                          key={e._id}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-3">
                            <Link
                              to={
                                currentUser?._id === e._id
                                  ? `/myprofile`
                                  : `/userProfile/${e._id}`
                              }
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden hover:brightness-90 cursor-pointer">
                                <img
                                  src={e.photo}
                                  alt={e.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            <Link
                              to={
                                currentUser?._id === e._id
                                  ? `/myprofile`
                                  : `/userProfile/${e._id}`
                              }
                            >
                              <h3 className="font-medium hover:underline">
                                {e.name}
                              </h3>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`inset-0 bg-black/60 fixed w-full min-h-screen z-50 flex items-center justify-center pt-14 ${showFollowing && "hidden"}`}
              >
                <div className="bg-white dark:bg-[#252728] rounded-2xl w-150 h-100 shadow-lg">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 border-b p-2">
                      <h2 className="ms-2 font-semibold text-3xl">
                        All Following
                      </h2>
                      <div
                        onClick={() => setShowFollowing(!showFollowing)}
                        className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 dark:hover:bg-white/10"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center text-3xl mb-4 font-bold">
                      No following
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            <div className="py-6">
              <div className="flex flex-col gap-6">
                {userPosts?.map((post) => (
                  <PostCard key={post._id} post={post} myProfile />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MyProfile;