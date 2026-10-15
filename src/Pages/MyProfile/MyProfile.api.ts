import { axiosInterseptore } from "../../Components/AxiosInterseptore";
import type { changePhotoResponseType, MyProfileResponseType } from "./MyProfile.interface";

export async function handleChangePhoto(data:FormData):Promise<string> {
    const res = await axiosInterseptore.put<changePhotoResponseType>('/users/upload-photo', data)
    return res.data.message
}

export async function getMyProfile() {
    const res = await axiosInterseptore.get<MyProfileResponseType>('/users/profile-data')
    return res.data.data.user
}
