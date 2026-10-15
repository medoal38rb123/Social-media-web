import { axiosInterseptore } from "../AxiosInterseptore";
import type { FollowSugestionsResponseType } from "./FollowSugestions.interface";

export async function getFollowSugestions() {
    const res = await axiosInterseptore.get<FollowSugestionsResponseType>('/users/suggestions?limit=10')
    return res.data.data.suggestions
}