import type { UserData } from "./AuthContextProvider.interface";
import { axiosInterseptore } from "../../Components/AxiosInterseptore";

export async function getUserData(): Promise<null | UserData> {
    try {
        const res = await axiosInterseptore.get('/users/profile-data')
        return res.data.data.user
    } catch(error) {
        return null
    }
}