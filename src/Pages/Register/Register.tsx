import RegisterForm from "./RegisterForm"


function Register() {

    return (
        <>
        <div className="flex flex-col gap-10 items-center">
            <h1 className="text-main-color text-6xl font-medium">Register</h1>
            <RegisterForm/>
        </div>
        </>
    )
}

export default Register
