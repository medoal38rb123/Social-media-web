import axios from "axios";
import { router } from "./main";

export const axiosInterseptore = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

axiosInterseptore.interceptors.request.use(
    function(request) {
        if (localStorage.getItem("user_tkn")) {
            request.headers.token = localStorage.getItem("user_tkn")
        }
        return request
    },
    function(error) {
        return Promise.reject(error)
    }
)

axiosInterseptore.interceptors.response.use(
    function(response) {
        return response
    },
    function(error) {
        if (error.response && error.response.status === 401) {
            router.navigate("/login")
        }
        return Promise.reject(error)
    }
)