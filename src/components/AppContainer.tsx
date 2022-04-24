import { User } from "../interfaces/UserActions";
import Nav from "./Nav";

export default function AppContainer(props: {children: React.ReactNode, currentUser: User}) {
    return (
        <div className="flex flex-col h-screen bg-gray-100 items-center justify-center gap-4">
            <Nav currentUser={props.currentUser}/>
            <div className="w-1/2 p-4 mx-auto bg-white shadow-lg rounded-xl flex flex-col gap-2 max-h-[90%] overflow-scroll">
                {props.children}
            </div>
        </div>
    );
}