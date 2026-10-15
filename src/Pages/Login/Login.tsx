import LoginForm from "./LoginForm"

function Login() {

    return (
        <>
        <div className="flex flex-col gap-10 items-center">
            <h1 className="text-main-color text-6xl font-medium">Login</h1>
            <LoginForm/>
        </div>
        </>
    )
}

export default Login
