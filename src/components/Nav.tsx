import { User } from "../interfaces/UserActions";
import { Link } from "raviger";

const LinkButton = (props: {href: string, children: React.ReactNode}) => <Link className="border-b-2 border-b-white border-dotted hover:border-solid" href={props.href}>
    {props.children}
</Link>

export default function Nav(props: {currentUser: User}) {

    const userExists = props.currentUser && props.currentUser.username.length > 0

    return (
        <div className="flex gap-2 py-4 bg-slate-900 rounded-lg shadow-md text-white p-2 w-1/2">
            { userExists && <>
                <p className="font-bold">Hi {props.currentUser.username}!</p>
                <LinkButton href="/"> Home </LinkButton>
            </> }
            { !userExists && <LinkButton href="/login">Login</LinkButton> }
            { userExists && <button onClick={e => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }}
                className="border-b-2 border-b-white border-dotted hover:border-solid"
            >
                Logout
            </button> }
        </div>
    )
}