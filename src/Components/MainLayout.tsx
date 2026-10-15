import { Outlet} from "react-router"
import Navbar from "./Navbar"
import { Toaster } from "react-hot-toast"

function MainLayout() {

    return (
        <>
            <Navbar/>
            <div className="flex">
                <div className="min-h-screen flex-1">
                    <Outlet/>
                    <Toaster/>
                </div>
            </div>
        </>
    )
}

export default MainLayout
