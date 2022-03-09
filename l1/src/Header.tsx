import React from "react";
import logo from "./logo.svg";

export default function Header(props: {title: string}) {
    return (
        <div className="flex gap-4 items-center">
            <img src={logo} alt="logo" className="animate-spin w-20" />
            <code className="text-center text-xl">
                {props.title}
            </code>
        </div>
    );
}