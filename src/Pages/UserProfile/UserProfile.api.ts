import { axiosInterseptore } from "../../Components/AxiosInterseptore";
import type { FollowUserResponseType, UserProfileResponseType } from "./UserProfile.interface";

export async function getUserProfile(userId:string) {
    const res = await axiosInterseptore.get<UserProfileResponseType>(`/users/${userId}/profile`)
    return res.data.data.user
}

export async function followUser(userId:string) {
    const res = await axiosInterseptore.put<FollowUserResponseType>(`/users/${userId}/follow`)
    return res.data.data.following
}