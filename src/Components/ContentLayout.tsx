import { useContext } from "react";
import { Outlet, useLocation } from "react-router";
import { authContext } from "../Context/AuthContext/AuthContextProvider";
// import RightContent from "./RightContent";
import LeftContent from "./LeftContent";

function ContentLayout() {
  const { currentUser } = useContext(authContext);
  const location = useLocation();
  const authProfile = location.pathname === "/myprofile";

  return (
    <>
      <div className="flex">
        {currentUser && (
          <div className="min-h-screen hidden w-64 md:block">
            <LeftContent />
          </div>
        )}
        <div className={`flex-1 pt-26 ${authProfile ? 'px-26' : 'px-10 lg:px-30 xl:px-50'} pb-12 dark:bg-[#1C1C1D]`}>
          <Outlet />
        </div>
        {/* {!authProfile && (
          <div className=" min-h-screen w-50 hidden lg:block pt-24 px-8">
            <RightContent />
          </div>
        )} */}
      </div>
    </>
  );
}

export default ContentLayout;
