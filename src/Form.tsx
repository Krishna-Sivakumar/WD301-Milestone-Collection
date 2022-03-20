import { useEffect, useRef, useState } from "react"
import Field from "./interfaces/Field";

import Header from "./Header"
import Cancel from "./cancel.svg";
import LabelledInput from "./components/LabelledInput"

interface FormData {
    id: number,
    title: string,
    fields: Field[]
}

const formFields: Field[] = [
  {
    id: 1,
    label: "first name",
  },
  {
    id: 2,
    label: "last name",
    value: "",
  },
  {
    id: 3,
    label: "email",
    type: "email",
    value: "",
  },
  {
    id: 4,
    label: "date of birth",
    type: "date",
    value: "",
  },
  {
    id: 5,
    label: "phone number",
    type: "tel",
    value: "",
  }
];

const formData: FormData = {
    id: Number(new Date()),
    title: "Form",
    fields: formFields,
}


const initialState: () => FormData = () => {
    const formDataJSON = localStorage.getItem("formData");
    const persistentFormData: FormData = formDataJSON ? JSON.parse(formDataJSON) : formData;
    return persistentFormData;
}

const saveForm = (currentState: FormData) => {
    localStorage.setItem("formData", JSON.stringify(currentState))
}

export default function Form(props: {closeFormCB: () => void}) {
    const [formState, setFormState] = useState(initialState());
    const [newField, setNewField] = useState({
        label: "",
        type: ""
    });
    const fieldRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const oldTitle = document.title;
        document.title = `${oldTitle} | Form Editor`;

        return () => {
            document.title = oldTitle;
        }
    }, [])

    useEffect(() => {
        let timeout = setTimeout(() => {
            saveForm(formState);
        }, 200);


        return () => {
            clearTimeout(timeout);
        }
    }, [formState])

    const addField = () => {
        setFormState({
            ...formState,
            fields: [
                ...formState.fields,
                {
                    id: Number(new Date()),
                    label: newField.label.length ? newField.label : "new field",
                    type: newField.type.length? newField.type : "text",
                    value: ""
                }
            ]
        });

        setNewField({label: "", type: ""});
    };

    const removeField = (id: number) => {
        setFormState(
            {
                ...formState,
                fields: formState.fields.filter(field => field.id !== id)
            }
        )
    };

    const mutateField = (id: number, value: string) => {
        setFormState(oldState => {
            let field: Field = oldState.fields.filter(field => field.id === id)[0];
            return {
                ...oldState,
                fields: [
                    ...oldState.fields.filter(field => field.id !== id),
                    {
                        ...field,
                        value: value
                    }
                ].sort((a, b) => a.id - b.id)
            }
        });
    }

    const clearForm = () => {
        setFormState(oldState => {
            return {
                ...oldState,
                fields: oldState.fields.map(field => ({...field, value: ""}))
            };
        })
    }

    return (
        <>
            <button onClick={props.closeFormCB} className="bg-red-500 rounded-full shadow-2xl w-fit p-1 active:brightness-75 hover:brightness-95 float-right ml-auto">
                <img src={Cancel} className="w-4 h-4" alt="close form"/>
            </button>
            <Header 
            title={formState.title}
            />

            {
                formState.fields.map(
                    field =>
                    <LabelledInput field={field} removeFieldCB={removeField} mutateFieldCB={mutateField} />
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
                <input
                    type="text"
                    value={newField.type}
                    onChange={e => setNewField({
                            ...newField,
                            type: e.target.value
                        })
                    }
                    className="border-2 border-gray-200 rounded-lg p-2 w-full"
                    placeholder="Type"
                />
                <input type="button" value="Add Field" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95" onClick={addField} />
            </div>
            <div className="flex gap-2">
                <input type="button" value="clear form" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full p-2 active:brightness-75 hover:brightness-95 capitalize" onClick={clearForm} />
                <input type="button" value="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full p-2 active:brightness-75 hover:brightness-95 capitalize" onClick={() => {saveForm(formState); fieldRef.current?.focus()}} />
            </div>
        </>
    );
}