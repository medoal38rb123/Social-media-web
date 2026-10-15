import { Button } from "@heroui/react"


function AppButton({children, ...props}: React.ComponentProps<typeof Button>) {

    return (
        <>
            <Button {...props}>{children}</Button>
        </>
    )
}

export default AppButton
