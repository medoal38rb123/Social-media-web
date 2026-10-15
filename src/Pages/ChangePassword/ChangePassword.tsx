import ShangePasswordForm from "./ChangePasswordForm";

function ChangePassword() {
  return (
    <>
      <div className="flex flex-col gap-10 items-center">
        <h1 className="text-main-color text-5xl font-semibold">Shange Password</h1>
        <ShangePasswordForm />
      </div>
    </>
  );
}

export default ChangePassword;
