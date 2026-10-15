import { ThreeCircles } from "react-loader-spinner";

function PostsLoading() {
  return (
    <>
      <div className="fixed inset-0 dark:bg-[#252728] bg-white flex justify-center items-center">
        <ThreeCircles
          visible={true}
          height="100"
          width="100"
          color="#BA68C8"
          ariaLabel="three-circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </>
  );
}

export default PostsLoading;
