import { createContext, useEffect, useState } from "react";
import type { AuthContextType, UserData } from "./AuthContextProvider.interface";
import { getUserData } from "./AuthContextProvider.api";

export const authContext = createContext<AuthContextType>({
    currentUser: null,
    setCurrentUser: () => {},
    isLoading: true
})

function AuthContextProvider({children}: {children:React.ReactNode}) {
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            const userData = await getUserData();
            setCurrentUser(userData);
            setIsLoading(false)
        }
        

        getUser();
    }, []);

    return (
        <>
            <authContext.Provider value={{currentUser, setCurrentUser, isLoading}}>
                {children}
            </authContext.Provider>
        </>
    )
}

export default AuthContextProvider
