import React from "react";

export default function AppContainer(props: {children: React.ReactNode}) {
    return (
        <div className="flex h-screen bg-gray-100 items-center">
            <div className="w-1/3 p-4 mx-auto bg-white shadow-lg rounded-xl flex flex-col gap-2">
                {props.children}
            </div>
        </div>
    );
}