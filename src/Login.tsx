import { navigate } from "raviger";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { request } from "./ApiUtils"

export default function Login() {

    const [formState, setFormState] = useState({
        username: "",
        password: ""
    })

    const [lock, setLock] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/");
    })

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        await setLock(true);
        try {
            toast("Logging you in...")
            const res : {token: string} = await request("/auth-token", "POST", formState)
            if (res.token) {
                localStorage.setItem("token", res.token);
                navigate("/");
                toast.success("Logged in!");
            } else {
                toast.error("Invalid credentials; Try again.")
                setFormState({username: "", password: ""});
                setLock(false);
            }
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="py-4 flex flex-col gap-4">
            <label className="font-bold capitalize">Username</label>
            <input
                type="text"
                value={formState.username}
                className="border-2 border-gray-200 rounded-lg p-2 w-full"
                onChange={e => setFormState({...formState, username: e.target.value})}
            />
            <label className="font-bold capitalize">Password</label>
            <input
                type="password"
                value={formState.password}
                className="border-2 border-gray-200 rounded-lg p-2 w-full"
                onChange={e => setFormState({...formState, password: e.target.value})}
            />
            <input
                type="submit"
                value="Login"
                className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full p-2 active:brightness-75 hover:brightness-95 capitalize disabled:opacity-80"
                disabled={lock}
            />
        </form>
    )
}