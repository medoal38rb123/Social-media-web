import {
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  TextField,
  Select,
  DatePicker,
  DateField,
  Calendar,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeSlash } from "iconsax-reactjs";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { parseDate } from "@internationalized/date";
import { registerSchema } from "./Register.zod";
import { sendUserDataRegister } from "./Register.api";
import type { UserDataType } from "./Register.Interface";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AppButton from "../../Shared Components/App button/AppButton";
import { authContext } from "../../Context/AuthContext/AuthContextProvider";
import { useQueryClient } from "@tanstack/react-query";

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setCurrentUser } = useContext(authContext);
  const [showRePassword, setReShowPassword] = useState(false);
  const myQuery = useQueryClient();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: undefined,
    },
    resolver: zodResolver(registerSchema),
  });
  const passwordValue = watch("password");
  const rePasswordValue = watch("rePassword");
  const navigate = useNavigate();

  function showUserPassword() {
    setShowPassword(!showPassword);
  }
  function showUserRePassword() {
    setReShowPassword(!showRePassword);
  }

  async function handleRegister(data: UserDataType) {
    try {
      const res = await toast.promise(sendUserDataRegister(data), {
        loading: "Please wait",
        success: (res) => res.message,
        error: (msg) => msg.message,
      });

      localStorage.setItem("user_tkn", res.data.token);
      setCurrentUser(res.data.user);
      reset();
      myQuery.invalidateQueries({ queryKey: ["HomeFeed"] });
      myQuery.invalidateQueries({ queryKey: ["AllPosts"] });
      myQuery.invalidateQueries({ queryKey: ["Notifications"] });
      navigate("/posts");
    } catch {
      setCurrentUser(null);
    }
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit(handleRegister)}
        className="flex w-96 flex-col gap-4 min-w-3xl rounded-3xl bg-white p-8 shadow-2xl"
      >
        <TextField isRequired name="name" type="text" isInvalid={!!errors.name}>
          <Label>Name</Label>
          <Input
            {...register("name")}
            className="focus:ring-main-color"
            placeholder="Enter your name"
          />
          <FieldError />
          {errors.name && (
            <span className="text-red-500 text-xs">{errors.name?.message}</span>
          )}
        </TextField>
        <TextField
          isRequired
          name="userName"
          type="text"
          isInvalid={!!errors.username}
        >
          <Label>User Name</Label>
          <Input
            {...register("username")}
            className="focus:ring-main-color"
            placeholder="Enter your user name"
          />
          <FieldError />
          {errors.username && (
            <span className="text-red-500 text-xs">
              {errors.username?.message}
            </span>
          )}
        </TextField>
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
        <TextField
          isRequired
          className="relative"
          name="repassword"
          type={showRePassword ? "text" : "password"}
          isInvalid={!!errors.rePassword}
        >
          <Label>Confirm Password</Label>
          <Input
            {...register("rePassword")}
            className="focus:ring-main-color"
            placeholder="Confirm your password"
          />
          <FieldError />
          {errors.rePassword && (
            <span className="text-red-500 text-xs">
              {errors.rePassword?.message}
            </span>
          )}
          {rePasswordValue && (
            <button
              type="button"
              onClick={showUserRePassword}
              className="absolute top-1/2 translate-y-1 inset-e-3 cursor-pointer"
            >
              {showRePassword ? (
                <Eye size="18" className="text-gray-400" variant="Bold" />
              ) : (
                <EyeSlash size="18" className="text-gray-400" variant="Bold" />
              )}
            </button>
          )}
        </TextField>
        <Controller
          name="dateOfBirth"
          control={control}
          render={function ({ field }) {
            return (
              <DatePicker
                isInvalid={!!errors.dateOfBirth}
                className="w-full"
                value={field.value ? parseDate(field.value) : null}
                onChange={(date) => field.onChange(date?.toString() ?? "")}
              >
                <Label>Date</Label>
                <DateField.Group fullWidth>
                  <DateField.Input className="focus:ring-main-color">
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <FieldError>{errors.dateOfBirth?.message}</FieldError>
                <DatePicker.Popover>
                  <Calendar aria-label="Event date">
                    <Calendar.Header>
                      <Calendar.YearPickerTrigger>
                        <Calendar.YearPickerTriggerHeading />
                        <Calendar.YearPickerTriggerIndicator />
                      </Calendar.YearPickerTrigger>
                      <Calendar.NavButton slot="previous" />
                      <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => (
                          <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                        )}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>
            );
          }}
        />
        <Controller
          name="gender"
          control={control}
          render={function ({ field }) {
            return (
              <Select
                {...field}
                className="w-full"
                placeholder="Select one"
                isInvalid={!!errors.gender}
              >
                <Label>Gender</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="male" textValue="Male">
                      Male
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="female" textValue="Female">
                      Female
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            );
          }}
        />

        <div className="flex flex-col gap-2">
          <AppButton
            className="w-full bg-main-color"
            type="submit"
            isDisabled={isSubmitting}
          >
            <Check />
            Register
          </AppButton>
          <AppButton
            onClick={(_) => reset()}
            className="w-full"
            type="button"
            variant="danger-soft"
          >
            Reset
          </AppButton>
        </div>
      </Form>
    </>
  );
}

export default RegisterForm;
