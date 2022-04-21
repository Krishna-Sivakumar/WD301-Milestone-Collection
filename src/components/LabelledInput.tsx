import { useState } from "react";
import Field from "../interfaces/Field"
import {MultiSelectField} from "../interfaces/Field";

function MultiSelectDropdown(props: {
    field: MultiSelectField,
    mutateOptionsCB: (id: number, value: number, checked: boolean) => void
}) {

    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col w-full">
            <div className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize flex justify-between" onClick={ e => setOpen(!open) }>
                {props.field.label}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </div>
            {
                open && <div className="flex flex-col border-2 border-gray-200 rounded-lg p-2 w-full mt-2">
                    {
                        props.field.options.sort((a,b) => a.name.localeCompare(b.name)).map(
                            option => <div
                                className="flex items-center hover:bg-blue-600 hover:text-white gap-2 rounded-md p-2"
                            >
                                <input type="checkbox" defaultChecked={option.id in props.field.selected} onChange={ e => {
                                    props.mutateOptionsCB(props.field.id, option.id, e.target.checked)
                                }}  />
                                <label>{option.name}</label>
                            </div>
                        )
                    }
                </div>
            }
        </div>
    )
}

export default function LabelledInput(props: {
        canRemove?: boolean,
        field: Field, 
        removeFieldCB: (id: number) => void,
        mutateFieldCB: (id: number, value: string) => void,
        mutateOptionsCB: (id: number, value: number, checked: boolean) => void
    },
    ) {

    const generateField = (field : Field) => {
        switch(field.kind) {
            case "range":
                return (
                    <div className="flex w-full gap-1">
                        <span className="font-bold text-slate-600">{field.min}</span>
                        <input
                            type="range"
                            value={field.value}
                            max={field.max}
                            min={field.min}
                            className="w-full"
                            onChange={
                                e => props.mutateFieldCB(field.id, e.target.value)
                            }
                        />
                        <span className="font-bold text-slate-600">{field.max}</span>
                    </div>
                )
            case "input":
                return (
                    <input
                        type={field.type ?? "text"}
                        value={field.value}
                        className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize" 
                        onChange={e => {
                            props.mutateFieldCB(field.id, e.target.value)
                        }}
                    />
                )
            case "textarea":
                return (
                    <textarea
                        cols={30}
                        rows={10}
                        value={field.value}
                        className="border-2 border-gray-200 rounded-lg w-full p-2"
                        onChange={e => {
                            props.mutateFieldCB(field.id, e.target.value)
                        }}
                    >
                    </textarea>
                )
            case "radio":
                return (
                    <fieldset className="grid grid-cols-2 gap-4">
                        {
                            field.options.map(
                                option => <>
                                    <label>{option}</label>
                                    <input type="radio" className="place-self-center" name={field.label} value={option} onChange={
                                        e => {
                                            props.mutateFieldCB(field.id, e.target.value)
                                        }
                                    } />
                                </>
                            )
                        }
                    </fieldset>
                )
            case "multi":
                return <MultiSelectDropdown field={field} mutateOptionsCB={props.mutateOptionsCB}/>
        }
    }

    return (
        <div className="w-full" key={props.field.id}>
            <label className="font-semibold capitalize">{props.field.label}</label>
            <div className="flex gap-2 items-center">
                {generateField(props.field)}
                { props.canRemove && <input
                    type="button"
                    value="Remove"
                    onClick={() => props.removeFieldCB(props.field.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95"
                />}
            </div>
        </div>
    );
}