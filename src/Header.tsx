import React from "react";
import logo from "./logo.svg";

export default function Header(props: {title: string, mutateTitleCB: (value: string) => void}) {
    return (
        <div className="flex gap-4 items-center">
            <img src={logo} alt="logo" className="animate-spin w-20" />
            <input
                type="text" 
                value = {props.title}
                onChange={e => props.mutateTitleCB(
                    e.target.value
                )}
                className="border-2 border-gray-200 rounded-lg p-2 w-full"
                placeholder="Title"
            />
        </div>
    );
}