import { useState } from "react";
import FormData from "../interfaces/FormData";
import BinIcon from "../icons/BinIcon";
import OpenIcon from "../icons/OpenIcon";
import { getLocalForms, saveLocalForms } from "../State";

export function Home(props: {openFormCB: (id: number) => void}) {

    const [state, setState] = useState(() => getLocalForms())

    const addLocalForm = () => {
        const newForm: FormData = {
            id: Number(new Date()),
            title: "Form",
            fields: [],
        }

        saveLocalForms([
            ...state,
            newForm
        ])

        setState(getLocalForms());
    }

    const removeLocalForm = (id: number) => {
        saveLocalForms(
            state.filter(form => form.id !== id)
        )
        setState(getLocalForms());
    }

    return (
        <div className="flex flex-col gap-3">
            {state.map(
                form => (
                    <div className="flex gap-2 items-center" key={form.id}>
                        <span className="font-bold mr-auto">{form.title}</span>
                        <button
                            className = "bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit active:brightness-75 hover:brightness-95 p-2 flex items-center gap-2 capitalize"
                            onClick={() => props.openFormCB(form.id)}
                        >
                            <OpenIcon/>
                            open
                        </button>
                        <button
                            className = "bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-xl text-white font-bold active:brightness-75 hover:brightness-95 p-2 flex items-center gap-2 capitalize"
                            onClick={() => removeLocalForm(form.id)}
                        >
                            <BinIcon/>
                            delete
                        </button>
                    </div>
                )
            )}

            {
                state.length === 0 &&
                <p className="text-gray-500 font-bold text-2xl">No forms created :(</p>
            }

            <button
                className = "bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full active:brightness-75 hover:brightness-95 py-2 my-2"
                onClick={addLocalForm}
            >
                New
            </button>
        </div>
    );
}