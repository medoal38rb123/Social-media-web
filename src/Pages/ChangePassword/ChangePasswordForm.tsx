import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangePasswordSchema } from "./ChangePassword.zod";
import toast from "react-hot-toast";
import { getNewPassword } from "./ChangePassword.api";
import { useNavigate } from "react-router";
import type { UserDataType } from "./ChangePassword.interface";

function ChangePasswordForm() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  async function handleChangePassword(data: UserDataType) {
    try {
      const res = await toast.promise(getNewPassword(data), {
        loading: "Please wait",
        success: (res) => res.message,
        error: (error) => error.message,
      });
      localStorage.setItem('user_tkn', res.data.token)
      navigate("/");
    } catch {}
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit(handleChangePassword)}
        className="flex w-96 flex-col gap-6 min-w-3xl rounded-3xl bg-white p-8 shadow-2xl"
      >
        <TextField isRequired minLength={8} name="userPassword" type="password">
          <Label>Your Password</Label>
          <Input
            {...register("password")}
            placeholder="Enter your password"
            className="focus:ring-main-color"
          />
          <FieldError />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password?.message}
            </span>
          )}
        </TextField>
        <TextField
          isRequired
          minLength={8}
          name="userNewPassword"
          type="password"
        >
          <Label>Your New Password</Label>
          <Input
            {...register("newPassword")}
            placeholder="Enter your new password"
            className="focus:ring-main-color"
          />
          <FieldError />
          {errors.newPassword && (
            <span className="text-red-500 text-xs">
              {errors.newPassword?.message}
            </span>
          )}
        </TextField>
        <div className="flex flex-col gap-2">
          <Button
            isDisabled={isSubmitting}
            type="submit"
            className="w-full bg-main-color"
          >
            Confirm
          </Button>
        </div>
      </Form>
    </>
  );
}

export default ChangePasswordForm;
