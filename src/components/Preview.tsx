import { useEffect, useRef, useState } from "react"
import Field from "../interfaces/Field";

import LabelledInput from "./LabelledInput";
import Cancel from "../cancel.svg";
import { getLocalForms, saveLocalForms } from "../State";
import { Link } from "raviger";

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

function Paginator(props: {id: number, fields: Field[], current: number}) {
    return (
        <div className="flex rounded-lg shadow-lg">
            {
                (props.current > 0) ?
                <Link className="bg-slate-300 rounded-l-lg p-2 text-slate-700 font-bold border-r-2 border-r-slate-400" href={`/preview/${props.id}/${props.current-1}`}> Previous </Link>
                : <p className="bg-slate-300 rounded-l-lg p-2 text-slate-400 font-bold border-r-2 border-r-slate-400">Previous</p>
            }
            {
                (props.current < props.fields.length - 1) ?
                <Link className="bg-slate-300 rounded-r-lg p-2 text-slate-700 font-bold" href={`/preview/${props.id}/${props.current+1}`}> Next </Link> :
                <p className="bg-slate-300 rounded-r-lg p-2 text-slate-400 font-bold">
                    Next
                </p>
            }
        </div>
    )
}

export default function Preview(props: {id?: string, page: string}) {
    const id = Number(props.id)
    const [formState, setFormState] = useState(() => initialState(id ? id : formData.id));
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

    const currentField = formState.fields[Number(props.page)];

    return (
        <>
            <Link href="/" className="bg-red-500 rounded-full shadow-2xl w-fit p-1 active:brightness-75 hover:brightness-95 float-right ml-auto">
                <img src={Cancel} className="w-4 h-4" alt="close form"/>
            </Link>

            <div className="flex gap-2 items-center">
                <p className="w-full font-bold text-2xl">{formState.title}</p>
            </div>

            <div className="flex flex-col items-start gap-4">
                <LabelledInput key={currentField.id} field={currentField} removeFieldCB={removeField} mutateFieldCB={mutateField}/>

                <Paginator fields={formState.fields} id={id} current={Number(props.page)}/>
            </div>
        </>
    );
}