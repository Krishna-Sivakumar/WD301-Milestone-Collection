import { useEffect, useRef, useState } from "react"
import Field from "./interfaces/Field";

import Header from "./Header"
import Cancel from "./cancel.svg";
import LabelledInput from "./components/LabelledInput"
import { getLocalForms, saveLocalForms } from "./State";

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

const initialState: (id?: number) => FormData = (id?: number) => {
    const localForms = getLocalForms();
    if (localForms.length > 0 && id !== 0) {
        return localForms.filter(form => form.id === id)[0];
    }
    saveLocalForms([...localForms, formData]);
    return formData;
}

const saveForm = (currentState: FormData) => {
    const localForms = getLocalForms();
    const updatedLocalForms = localForms.map(form => (
        form.id === currentState.id ? currentState : form
    ));
    saveLocalForms(updatedLocalForms);
}

export default function Form(props: {closeFormCB: () => void, id?: number}) {
    const [formState, setFormState] = useState(() => initialState(props.id ? props.id : formData.id));
    const [newField, setNewField] = useState({
        label: "",
        type: ""
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

    const mutateTitle = (value: string) => {
        setFormState(
            oldState => ({
                    ...oldState,
                    title: value,
            })
        )
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
            mutateTitleCB={mutateTitle}
            />

            {
                formState.fields.map(
                    field =>
                    <LabelledInput key={field.id} field={field} removeFieldCB={removeField} mutateFieldCB={mutateField} />
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