import {
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeSlash } from "iconsax-reactjs";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "./Login.zod";
import { sendUserDataLogin } from "./Login.api";
import type { UserDataType } from "./Login.Interface";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import AppButton from "../../Shared Components/App button/AppButton";
import { authContext } from "../../Context/AuthContext/AuthContextProvider";
import { useQueryClient } from "@tanstack/react-query";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser } = useContext(authContext);
  const myQuery = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const passwordValue = watch("password");
  const Navigate = useNavigate();

  function showUserPassword() {
    setShowPassword(!showPassword);
  }

  async function handleLogin(data: UserDataType) {
    try {
      const res = await toast.promise(sendUserDataLogin(data), {
        loading: "Please wait",
        success: (res) => res.message,
        error: (error) => error.message,
      });

      localStorage.setItem("user_tkn", res.data.token);
      setCurrentUser(res.data.user);

      reset();
      myQuery.invalidateQueries({ queryKey: ["HomeFeed"] });
      myQuery.invalidateQueries({ queryKey: ["AllPosts"] });
      myQuery.invalidateQueries({ queryKey: ["Notifications"] });

      Navigate("/posts");
    } catch {
      setCurrentUser(null);
    }
  }
  return (
    <>
      <Form
        onSubmit={handleSubmit(handleLogin)}
        className="flex w-96 flex-col gap-4 min-w-3xl rounded-3xl bg-white p-8 shadow-2xl"
      >
        <TextField
          isRequired
          name="email"
          type="email"
          isInvalid={!!errors.email}
        >
          <Label>Email</Label>
          <Input
            {...register("email")}
            className="focus:ring-main-color"
            placeholder="john@example.com"
          />
          <FieldError />
          {errors.email && (
            <span className="text-red-500 text-xs">
              {errors.email?.message}
            </span>
          )}
        </TextField>
        <TextField
          isRequired
          className="relative"
          name="password"
          type={showPassword ? "text" : "password"}
          isInvalid={!!errors.password}
        >
          <Label>Password</Label>
          <Input
            {...register("password")}
            className="focus:ring-main-color"
            placeholder="Enter your password"
          />
          <FieldError />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password?.message}
            </span>
          )}
          {passwordValue && (
            <button
              type="button"
              onClick={showUserPassword}
              className="absolute top-1/2 translate-y-1 inset-e-3 cursor-pointer"
            >
              {showPassword ? (
                <Eye size="18" className="text-gray-400" variant="Bold" />
              ) : (
                <EyeSlash size="18" className="text-gray-400" variant="Bold" />
              )}
            </button>
          )}
        </TextField>
        <div className="flex justify-between mb-4">
          <Checkbox name="remember-me">
            <Checkbox.Content>
              <Checkbox.Control className="before:bg-main-color">
                <Checkbox.Indicator />
              </Checkbox.Control>
              Remember me
            </Checkbox.Content>
          </Checkbox>
          <span className="text-main-color text-sm font-medium">
            <Link to="/forgotpassword">Forgot password?</Link>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <AppButton
            className="w-full bg-main-color"
            type="submit"
            isDisabled={isSubmitting}
          >
            <Check />
            Login
          </AppButton>
          <div className="flex items-center justify-center gap-3 or text-sm">
            or
          </div>
          <AppButton
            onClick={(_) => Navigate("/register")}
            className="w-full bg-seconed-main-color"
            type="button"
          >
            Create acount
          </AppButton>
        </div>
      </Form>
    </>
  );
}

export default LoginForm;
