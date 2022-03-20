import logo from "../logo.svg";

export function Home(props: {openFormCB: () => void}) {
    const spinStyle = {
        animation: "spin 3s linear infinite"
    };
    return (
        <div className="flex flex-col items-center">
            <img src={logo} className="h-48" style={spinStyle} alt="logo"/>
            <p className="font-bold">Welcome to the home page!</p>
            <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full active:brightness-75 hover:brightness-95 py-2 my-2"
                onClick={props.openFormCB}
            >
                Open Form
            </button>
        </div>
    );
}