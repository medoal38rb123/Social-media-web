import { Button } from "@heroui/react"
import { Link } from "react-router"

function NotFound() {

    return (
        <>
            <div className="flex flex-col items-center gap-3">
                <h1 className="text-5xl font-medium">Not Found</h1>
                <span className="text-6xl font-semibold text-main-color">404</span>
                <p className="text-xl font-medium">This page does not exist</p>
                <Button className='bg-main-color'><Link to='/'>Home</Link></Button>
            </div>
        </>
    )
}

export default NotFound
