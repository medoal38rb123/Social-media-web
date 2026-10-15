import { useContext } from "react";
import { authContext } from "../Context/AuthContext/AuthContextProvider";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getFollowSugestions } from "./FollowSugestions/FollowSugestions.api";
import DarkModeToggle from "./DarkModeToggle";

function LeftContent() {
  const { currentUser } = useContext(authContext);
  const { data: followSugestions } = useQuery({
    queryKey: ["followSugestions"],
    queryFn: () => getFollowSugestions(),
  });

  return (
    <aside
      id="default-sidebar"
      className="fixed dark:bg-[#1C1C1D] top-0 w-80 min-h-screen px-5 pt-20"
      aria-label="Sidebar"
    >
      <div className="flex flex-col">
        <div className="px-3 py-4 border-b-2 dark:border-white/20">
          <div className="flex flex-col items-start gap-3">
            <Link to="/myprofile" className="w-full">
              <div className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-white/10 p-2 rounded-xl transition-all w-full">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={currentUser?.photo}
                    alt={currentUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="font-medium">{currentUser?.name}</h2>
              </div>
            </Link>

            <Link to="/saves" className="w-full">
              <div className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-white/10 p-2 rounded-xl transition-all w-full">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-bookmark dark:bg-linear-to-b dark:from-main-color dark:to-[#cea0d6] dark:bg-clip-text dark:text-transparent"></i>
                </div>
                <h2 className="font-medium">Saves</h2>
              </div>
            </Link>

            <Link to="/changepassword" className="w-full">
              <div className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-white/10 p-2 rounded-xl transition-all w-full">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl">
                  <i className="fa-solid fa-key dark:bg-linear-to-b dark:from-[yellow] dark:to-[#e2e2a5] dark:bg-clip-text dark:text-transparent"></i>
                </div>
                <h2 className="font-medium">Change password</h2>
              </div>
            </Link>
          </div>
        </div>

        <div className="px-3 py-4 border-b-2 dark:border-white/20 flex-1">
          <h3 className="font-semibold text-2xl mb-4">Follow sugestions</h3>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-85 scrollbar-none">
            {followSugestions?.map((e) => (
              <Link key={e._id} to={`/userProfile/${e._id}`}>
                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={e.photo}
                      alt={e.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{e.name}</span>
                    {e.mutualFollowersCount > 0 && (
                      <div className="flex gap-1 text-gray-500 dark:text-gray-400 text-sm">
                        <span>{e.mutualFollowersCount}</span>
                        <span>Mutual followers</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="px-0 py-4">
          <div className="flex items-center justify-between dark:bg-[#252728] bg-gray-300 p-3 rounded-3xl">
            <div className="flex gap-2 items-center">
              <Link to={`myprofile`}>
                <div className="w-10 h-10 rounded-full overflow-hidden hover:brightness-90 transition-all">
                  <img
                    src={currentUser?.photo}
                    alt={currentUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="flex flex-col">
                <Link to={`myprofile`}>
                  <span className="font-semibold hover:underline cursor-pointer">
                    {currentUser?.name}
                  </span>
                </Link>
                <Link to={`myprofile`}>
                  <p className="text-gray-600 dark:text-gray-400 text-sm truncate max-w-30 hover:underline cursor-pointer">
                    {currentUser?.email}
                  </p>
                </Link>
              </div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftContent;
