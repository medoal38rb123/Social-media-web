import { useContext } from "react"
import { authContext } from "../Context/AuthContext/AuthContextProvider"
import { Navigate } from "react-router"

function AuthProtected({children}: {children: React.ReactNode}) {
    const {currentUser} = useContext(authContext)

    if(currentUser) {
        return <Navigate to={'/posts'}/>
    }

    return (
        children
    )
}

export default AuthProtected
