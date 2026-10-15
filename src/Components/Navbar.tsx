import { Avatar } from "@heroui/react";
import { BinanceCoin } from "iconsax-reactjs";
import { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import AppButton from "../Shared Components/App button/AppButton";
import { authContext } from "../Context/AuthContext/AuthContextProvider";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationsCount,
  readAllNotifications,
  readNotification,
} from "./Notifications/Notifications.api";

const NOTIFICATIONS_PAGE_SIZE = 10;

function Navbar() {
  const [userDetails, setUserDetails] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const { currentUser, setCurrentUser } = useContext(authContext);
  const [mobileNavbar, setIsMobileNavbar] = useState(true);
  const myQuery = useQueryClient();
  const initials = currentUser?.name
    ?.trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");

  function handleLogout() {
    localStorage.removeItem("user_tkn");
    setCurrentUser(null);
    setUserDetails(true);
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["Notifications"],
      queryFn: ({ pageParam }) => getNotifications(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === NOTIFICATIONS_PAGE_SIZE
          ? allPages.length + 1
          : undefined,
    });

  const notifications = data?.pages.flat();

  const { data: unreadNotifications } = useQuery({
    queryKey: ["UnreadNotifications"],
    queryFn: () => getUnreadNotificationsCount(),
  });

  const { mutate: readNotificationMutation } = useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      myQuery.invalidateQueries({ queryKey: ["Notifications"] });
      myQuery.invalidateQueries({ queryKey: ["UnreadNotifications"] });
    },
  });

  const { mutate: readAllNotificationsMutation } = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      myQuery.invalidateQueries({ queryKey: ["Notifications"] });
      myQuery.invalidateQueries({ queryKey: ["UnreadNotifications"] });
    },
  });

  function formatNotificationTime(date: string) {
    const now = new Date();
    const notificationDate = new Date(date);

    const diff = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);

    if (diff < 0) return "Just now";
    if (minutes < 1) return "Just now";
    if (hours < 1) return `${minutes}m`;
    if (days < 1) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return `${weeks}w`;
  }

  return (
    <>
      <nav className="bg-white dark:bg-[#252728] fixed w-full z-20 top-0 inset-s-0 shadow-sm">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4 navbar">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <BinanceCoin size="50" color="#ba68c8" variant="Outline" />
          </Link>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {currentUser ? (
              <div className="flex items-center gap-4 flex-row-reverse">
                <button
                  onClick={(_) => setUserDetails(!userDetails)}
                  type="button"
                  className="flex text-sm bg-neutral-primary cursor-pointer rounded-full md:me-0 focus:ring-0 active:scale-90 transition-all active:brightness-90"
                  id="user-menu-button"
                  aria-expanded="false"
                  data-dropdown-toggle="user-dropdown"
                  data-dropdown-placement="bottom"
                >
                  <span className="sr-only">Open user menu</span>
                  <Avatar>
                    <Avatar.Image
                      alt={currentUser?.email}
                      src={currentUser?.photo}
                    />
                    <Avatar.Fallback>{initials}</Avatar.Fallback>
                  </Avatar>
                </button>
                <div
                  onClick={(_) => setShowNotification(!showNotification)}
                  className="w-10 h-10 rounded-full flex items-center justify-center dark:bg-[#3B3D3E] hover:dark:brightness-110 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-all relative"
                >
                  <i className="fa-solid fa-bell"></i>
                  {(unreadNotifications ?? 0) > 0 && (
                    <span className="absolute -top-1 -inset-e-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-semibold">
                      {unreadNotifications! > 99 ? "99+" : unreadNotifications}
                    </span>
                  )}

                  <div
                    className={`${showNotification ? "hidden" : ""} z-50 absolute inset-e-0 xl:-inset-e-20 top-full w-96 pt-2`}
                    id="user-dropdown"
                  >
                    <div
                      className={`bg-white dark:bg-[#252728] rounded-xl shadow-lg overflow-y-auto scrollbar-none cursor-auto ${notifications?.length === 0 ? "max-h-[calc(100vh-100px)]" : "h-[calc(100vh-100px)]"}`}
                    >
                      <div className="py-3">
                        <div className="flex items-center justify-between mb-4 px-4">
                          <h4 className="font-bold text-2xl">Notification</h4>
                          <div
                            onClick={(_) => readAllNotificationsMutation()}
                            className="text-[12px] text-blue-600 font-medium cursor-pointer hover:underline transition-all"
                          >
                            Make all as read
                          </div>
                        </div>
                        {notifications?.length === 0 ? (
                          <div className="font-bold text-xl text-gray-500 p-4 flex flex-col items-center">
                            <p>You do not have any</p>
                            <span>notifications!</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 px-2">
                            {notifications?.map((e) => (
                              <Link
                                key={e._id}
                                to={`${e.entityType === "post" ? `/postdetails/${e.entityId}` : `userprofile/${e.actor._id}`}`}
                              >
                                <div
                                  onClick={(_) =>
                                    readNotificationMutation(e._id)
                                  }
                                  className="flex items-center justify-between p-2 dark:hover:bg-white/10 hover:bg-gray-100 rounded-xl transition-all pe-3"
                                >
                                  <div className="flex items-center gap-3 me-3">
                                    <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden relative">
                                      <img
                                        src={e.actor.photo}
                                        alt={e.actor.name}
                                        className="w-full h-full object-cover"
                                      />

                                      <div
                                        className={`w-6 h-6 rounded-full items-center justify-center 
                                        ${e.type === "like_post" && "bg-seconed-main-color"} 
                                        ${e.type === "follow_user" && "bg-main-color"} 
                                        ${e.type === "comment_post" && "bg-blue-600"} 
                                        ${e.type === "share_post" && "bg-gray-600"} text-white border-4 inset-e-0 font-bold absolute`}
                                      >
                                        {e.type === "like_post" && (
                                          <i className="fa-solid fa-thumbs-up"></i>
                                        )}
                                        {e.type === "follow_user" && (
                                          <i className="fa-solid fa-user-plus"></i>
                                        )}
                                        {e.type === "comment_post" && (
                                          <i className="fa-solid fa-comment"></i>
                                        )}
                                        {e.type === "share_post" && (
                                          <i className="fa-solid fa-share"></i>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col">
                                      <p
                                        className={`${e.isRead && "text-gray-500"} leading-tight`}
                                      >
                                        <span className="font-semibold">
                                          {e.actor.name}
                                        </span>{" "}
                                        {e.type === "like_post" &&
                                          "liked your post"}
                                        {e.type === "follow_user" &&
                                          "started following you"}
                                        {e.type === "comment_post" &&
                                          "commented your post"}
                                        {e.type === "share_post" &&
                                          "shared your post"}
                                      </p>
                                      <span className="text-seconed-main-color text-sm font-medium">
                                        {formatNotificationTime(e.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className={`${e.isRead && "hidden"} w-3 h-3 rounded-full shrink-0 bg-seconed-main-color`}
                                  ></div>
                                </div>
                              </Link>
                            ))}

                            {hasNextPage && (
                              <AppButton
                                type="button"
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  fetchNextPage();
                                }}
                                isDisabled={isFetchingNextPage}
                                className="w-full py-2 mt-1 mb-2 rounded-xl bg-main-color hover:brightness-95 text-sm font-semibold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isFetchingNextPage ? "Loading..." : "Show more"}
                              </AppButton>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <AppButton className="bg-main-color">
                  <Link to="/login">Login</Link>
                </AppButton>
                <AppButton className="bg-seconed-main-color">
                  <Link to="/register">Register</Link>
                </AppButton>
              </div>
            )}
            <div
              className={`${userDetails && "hidden"} z-50 absolute dark:bg-[#252728] bg-white inset-e-0 xl:inset-e-10 top-full  rounded-xl shadow-lg w-60`}
              id="user-dropdown"
            >
              <div className="px-4 py-3 border-b border-default">
                <span className="block text-heading font-medium">
                  {currentUser?.name}
                </span>
                <span className="block text-body truncate">
                  {currentUser?.email}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-2 font-medium">
                <Link
                  to="/myProfile"
                  className="inline-flex items-center w-full p-2 ps-3 dark:hover:bg-white/10 hover:bg-gray-200 hover:text-heading rounded-xl transition-all"
                >
                  Profile
                </Link>
                <Link
                  to="/saves"
                  className="inline-flex items-center w-full p-2 ps-3 dark:hover:bg-white/10 hover:bg-gray-200 hover:text-heading rounded-xl transition-all"
                >
                  Saves
                </Link>
                <Link
                  to="/changepassword"
                  className="inline-flex items-center w-full p-2 ps-3 dark:hover:bg-white/10 hover:bg-gray-200 hover:text-heading rounded-xl transition-all"
                >
                  Change password
                </Link>
                <Link
                  onClick={handleLogout}
                  to="/login"
                  className="inline-flex items-center w-full p-2 ps-3 dark:hover:bg-white/10 hover:bg-gray-200 hover:text-heading rounded-xl transition-all"
                >
                  Sign out
                </Link>
              </div>
            </div>
            <button
              onClick={(_) => setIsMobileNavbar(!mobileNavbar)}
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center ${mobileNavbar && "hidden"} justify-between w-full md:flex md:w-auto md:order-1`}
            id="navbar-user"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
              {currentUser && (
                <li>
                  <NavLink
                    to="/"
                    className="block py-2 px-3 bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0 text-xl font-medium hover:underline"
                    aria-current="page"
                  >
                    Home
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;