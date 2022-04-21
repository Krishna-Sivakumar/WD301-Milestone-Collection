import { useEffect, useRef, useState } from "react"
import Field from "./interfaces/Field";

import Header from "./components/Header"
import Cancel from "./cancel.svg";
import { getLocalForms, saveLocalForms } from "./State";
import { Link } from "raviger";
import FieldInput from "./components/FieldInput";

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
    const [formState, setFormState] = useState(() => initialState(id));
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

    const addField = () => {
        const generateField : () => Field = () => {

            const base = {
                id: Number(new Date()),
                label: newField.label.length ? newField.label : "new field",
            }
            
            switch (newField.kind) {
                case "input":
                    return {
                        ...base,
                        kind: "input",
                        type: newField.type.length ? newField.type : "text",
                        value: ""
                    } as Field
                case "textarea":
                    return {
                        ...base,
                        kind: "textarea",
                        value: ""
                    } as Field
                case "multi":
                    return {
                        ...base,
                        kind: "multi",
                        options: [],
                        selected: []
                    } as Field
                case "radio":
                    return {
                        ...base,
                        kind: "radio",
                        options: []
                    } as Field
                case "range":
                    return {
                        ...base,
                        kind: "range"
                    } as Field
            }
        }

        setFormState({
            ...formState,
            fields: [
                ...formState.fields,
                generateField()
            ]
        });

        setNewField({label: "", type: "", kind: "input"});
    };

    const removeField = (id: number) => {
        setFormState(
            {
                ...formState,
                fields: formState.fields.filter(field => field.id !== id)
            }
        )
    };

    const mutateField = (param: string) => {
        return (id: number, value: string) => {
            setFormState(oldState => {
                let field: Field = oldState.fields.filter(field => field.id === id)[0];

                const generateNewField : () => Field = () => {
                    switch(field.kind) {
                        case "input": return {
                            ...field,
                            value: param === "value" ? value : field.value,
                            label: param === "label" ? value : field.label,
                            type: param === "type" ? value : field.type,
                        }
                        case "multi": return {
                            ...field, // todo
                            label: param === "label" ? value : field.label,
                        }
                        case "radio": return {
                            ...field, // todo
                            label: param === "label" ? value : field.label,
                        }
                        case "range": return {
                            ...field, // todo
                            label: param === "label" ? value : field.label,
                        }
                        case "textarea": return {
                            ...field, // todo
                            value: param === "value" ? value : field.value,
                            label: param === "label" ? value : field.label,
                        }
                    }
                }

                return {
                    ...oldState,
                    fields: [
                        ...oldState.fields.filter(field => field.id !== id),
                        generateNewField()
                    ].sort((a, b) => a.id - b.id)
                }
            });
        }
    }

    const mutateFieldOptions = (id: number, value:
        {kind: "radio", content: string[]} |
        {kind: "multi", content: {id: number, name: string}[]}
    ) => {
        setFormState(oldState => {
            let field: Field = oldState.fields.filter(field => field.id === id)[0];

            const newObj = (() => {
                switch(field.kind) {
                    case "multi":
                        return {
                            ...field,
                            options: value.kind === "multi" ? value.content : field.options
                        }
                    case "radio":
                        return {
                            ...field,
                            options: value.kind === "radio" ? value.content : field.options
                        }
                    default:
                        return field
                }
            })()
            
            return {
                ...oldState,
                fields: [
                    ...oldState.fields.filter(field => field.id !== id),
                    newObj
                ].sort((a, b) => a.id -  b.id)
            }
        })
    }

    const mutateTitle = (value: string) => {
        setFormState(
            oldState => ({
                    ...oldState,
                    title: value,
            })
        )
    }

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
                mutateTitleCB={mutateTitle}
                id={id}
                hasPreview = {hasPreview}
            />

            {
                formState.fields.map(
                    field => <FieldInput
                        key={field.id}
                        field={field}
                        mutateFieldNameCB={mutateField("label")}
                        mutateFieldTypeCB={mutateField("type")}
                        mutateFieldOptionsCB={mutateFieldOptions}
                        removeFieldCB={removeField}
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
                            ele => <option value={ele}>{ele}</option>
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
                <input type="button" value="Add Field" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95" onClick={addField} />
            </div>
            <div className="flex gap-2">
                <input type="button" value="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full p-2 active:brightness-75 hover:brightness-95 capitalize" onClick={() => {saveForm(formState); fieldRef.current?.focus()}} />
            </div>
        </>
    );
}