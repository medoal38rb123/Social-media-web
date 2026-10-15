import { Outlet } from "react-router"


function PaddedLayout() {

    return (
        <>
            <div className="items-center justify-center pt-40 pb-20">
                <Outlet/>
            </div>
        </>
    )
}

export default PaddedLayout
