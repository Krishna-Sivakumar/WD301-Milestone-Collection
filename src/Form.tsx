import { useEffect, useRef, useState, useReducer } from "react"
import Field from "./interfaces/Field";

import Header from "./components/Header"
import Cancel from "./cancel.svg"
import { getLocalForms, saveLocalForms } from "./State";
import { Link } from "raviger";
import FieldInput from "./components/FieldInput";

import {reducer} from "./interfaces/Actions"

interface FormData {
    id: number,
    title: string,
    fields: Field[]
}

const initialState: (id?: number) => FormData = (id?: number) => {

    const empty : FormData = {
        id: 0,
        title: "",
        fields: []
    }

    const localForms = getLocalForms();
    return localForms.filter(form => form.id === id)[0] ?? empty;
}

const saveForm = (currentState: FormData) => {
    const localForms = getLocalForms();
    const updatedLocalForms = localForms.map(form => (
        form.id === currentState.id ? currentState : form
    ));
    saveLocalForms(updatedLocalForms);
}

export default function Form(props: {id?: string}) {
    const id = Number(props.id)
    const [newField, setNewField] = useState<{
        label: string,
        type: string,
        kind: "input" | "radio" | "multi" | "textarea" | "range"
    }>({
        label: "",
        type: "",
        kind: "input"
    });
    const fieldRef = useRef<HTMLInputElement>(null)

    const [formState, dispatchAction] = useReducer(reducer, null, () => initialState(id))

    useEffect(() => {
        const oldTitle = document.title;
        document.title = `${oldTitle} | ${formState.title}`;

        return () => {
            document.title = oldTitle;
        }
    }, [formState.title])

    useEffect(() => {
        let timeout = setTimeout(() => {
            saveForm(formState);
        }, 200);


        return () => {
            clearTimeout(timeout);
        }
    }, [formState])

    const hasPreview = formState.fields.length > 0;

    if (formState.id === 0)
        return (
            <>
                <Link href="/" className="bg-red-500 rounded-full shadow-2xl w-fit p-1 active:brightness-75 hover:brightness-95 float-right ml-auto">
                    <img src={Cancel} className="w-4 h-4" alt="close form"/>
                </Link>
                <p className="text-2xl text-gray-600 font-bold">
                    This form doesn't exist.
                </p>
            </>
        )

    return (
        <>
            <Link href="/" className="bg-red-500 rounded-full shadow-2xl w-fit p-1 active:brightness-75 hover:brightness-95 float-right ml-auto">
                <img src={Cancel} className="w-4 h-4" alt="close form"/>
            </Link>
            <Header
                title={formState.title}
                mutateTitleCB={(title: string) => dispatchAction({
                    actionType: "mutate_title",
                    title: title
                })}
                id={id}
                hasPreview = {hasPreview}
            />

            {
                formState.fields.map(
                    field => <FieldInput
                        key={field.id}
                        field={field}
                        mutateFieldNameCB={
                            (id: number, label: string) => dispatchAction({
                                actionType: "mutate_field",
                                kind: field.kind,
                                id: id,
                                label: label
                            })
                        }
                        mutateFieldTypeCB={
                            (id: number, type: string) => dispatchAction({
                                actionType: "mutate_field",
                                kind: field.kind,
                                id: id,
                                type: type
                            })
                        }
                        mutateMultiOptionsCB={
                            (id: number, options: {id: number, name: string}[]) => dispatchAction({
                                actionType: "mutate_field",
                                kind: "multi",
                                id: id,
                                options: options
                            })
                        }
                        mutateRadioOptionsCB={
                            (id: number, options: {id: number, name: string}[]) => dispatchAction({
                                actionType: "mutate_field",
                                kind: "radio",
                                id: id,
                                options: options
                            })
                        }
                        mutateRangeCB={
                            (id: number, value: {max?: string, min?: string}) => dispatchAction({
                                actionType: "mutate_field",
                                kind: "range",
                                id: id,
                                ...( value.max !== undefined &&  {max: value.max}),
                                ...( value.min !== undefined &&  {min: value.min}),
                            })
                        }
                        removeFieldCB={() => dispatchAction({
                            actionType: "remove_field",
                            id: field.id
                        })}
                    />
                )
            }

            <div className="flex gap-2 mt-8">
                <input
                    type="text"
                    value={newField.label}
                    ref={fieldRef}
                    onChange={e => setNewField({
                            ...newField,
                            label: e.target.value
                        })
                    }
                    className="border-2 border-gray-200 rounded-lg p-2 w-full"
                    placeholder="Label"
                />
                <select
                    value={newField.kind}
                    onChange={e => setNewField({
                        ...newField,
                        kind: e.target.value as ("input" | "radio" | "multi" | "textarea" | "range")
                    })}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full"
                >
                    {
                        ["input", "radio", "textarea", "multi", "range"].map(
                            ele => <option key={ele} value={ele}>{ele}</option>
                        )
                    }
                </select>
                { newField.kind === "input" && <select
                    value={newField.type}
                    onChange={e => setNewField({
                        ...newField,
                        type: e.target.value
                    })}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full"
                    placeholder="Type"
                >
                    <option value="text">text</option>
                    <option value="date">date</option>
                    <option value="time">time</option>
                    <option value="datetime-local">date and time</option>
                    <option value="number">number</option>
                </select>}
                <input 
                    type="button"
                    value="Add Field"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95" 
                    onClick={() => dispatchAction({
                        actionType: "add_field",
                        label: newField.label,
                        kind: newField.kind,
                        type: newField.type
                    })}
                />
            </div>
            <div className="flex gap-2">
                <input type="button" value="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full p-2 active:brightness-75 hover:brightness-95 capitalize" onClick={() => {saveForm(formState); fieldRef.current?.focus()}} />
            </div>
        </>
    );
}