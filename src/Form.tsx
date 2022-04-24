import { useEffect, useRef, useState, useReducer } from "react"

import Header from "./components/Header"
import Cancel from "./icons/cancel.svg"
import { Link, navigate } from "raviger";
import FieldInput from "./components/FieldInput";

import {reducer} from "./interfaces/Actions"
import { APIForm } from "./interfaces/ApiTypes";
import { getAPIFormFields, getAPIForm, createNewField, mutateField, deleteField } from "./ApiUtils";


export default function Form(props: {id?: string}) {
    const id = Number(props.id)

    const [newField, setNewField] = useState<{
        label: string,
        kind: "TEXT" | "DROPDOWN" | "RADIO" | "GENERIC",
    }>({
        label: "",
        kind: "TEXT"
    })

    const fieldRef = useRef<HTMLInputElement>(null)

    const [formState, dispatchAction] = useReducer(reducer, [])
    const [form, setForm] = useState<APIForm>({
        id: 0,
        title: ""
    });


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [])

    useEffect(() => {
        getAPIForm(id, setForm)
    }, [])

    const refreshAPIFormFields = () => {
        getAPIFormFields(id, fields => dispatchAction({
            actionType: "set_fields",
            fields: fields
        }))
    }

    useEffect(refreshAPIFormFields, [])


    const hasPreview = formState.length > 0;

    if (form.id === 0)
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
                title={form.title}
                mutateTitleCB={(title: string) => {}}
                id={id}
                hasPreview = {hasPreview}
            />

            {
                formState.map(
                    field => <FieldInput
                        key={field.id}
                        field={field}
                        mutateFieldNameCB={
                            async (fieldId: number, label: string) => {
                                dispatchAction({
                                    actionType: "mutate_field",
                                    id: fieldId,
                                    kind: field.kind,
                                    label: label,
                                    callback: (field) => mutateField(id, field)
                                });
                            }
                        }
                        mutateOptionsCB={
                            (fieldId: number, options: string[]) => {
                                dispatchAction({
                                    actionType: "mutate_field",
                                    id: fieldId,
                                    kind: field.kind,
                                    options: options,
                                    callback: (field) => mutateField(id, field),
                                })
                            }
                        }
                        removeFieldCB={
                            async (fieldId: number) => {
                                await deleteField(id, fieldId)
                                await refreshAPIFormFields();
                            }
                        }
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
                        kind: e.target.value as ("TEXT" | "DROPDOWN" | "RADIO" | "GENERIC")
                    })}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full"
                >
                    {
                        ["TEXT", "DROPDOWN", "RADIO", "GENERIC"].map(
                            ele => <option key={ele} value={ele}>{ele.toLowerCase()}</option>
                        )
                    }
                </select>
                <input 
                    type="button"
                    value="Add Field"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95" 
                    onClick={async () => {
                        await createNewField(id, newField);
                        await refreshAPIFormFields();
                    }}
                />
            </div>
        </>
    );
}