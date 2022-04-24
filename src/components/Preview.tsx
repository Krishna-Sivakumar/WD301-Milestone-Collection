import { useEffect, useReducer, useState } from "react"

import LabelledInput from "./LabelledInput";
import Cancel from "../icons/cancel.svg";
import { Link, navigate } from "raviger";

import {reducer} from "../interfaces/Actions"
import { APIAnswer, APIForm, APIFormField, APISubmission } from "../interfaces/ApiTypes";
import { getAPIForm, getAPIFormFields, mutateField, request } from "../ApiUtils";

async function submitAnswers(fields: APIFormField[], form: APIForm) {
    const answers: APIAnswer[] = fields.map(
        field => ({
            form_field: field.id || 0,
            value: field.value || ""
        })
    )


    const submission: APISubmission = {
        form: form,
        answers: answers
    }

    if (form.id) {
        return await request(`/forms/${form.id}/submission`, "POST", submission)
    }
}

function Paginator(props: {id: number, fields: APIFormField[], current: number}) {
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

export default function Preview(props: {id: string, page: string}) {
    const id = Number(props.id)
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

    const currentField = formState[Number(props.page)];

    if (formState.length === 0)
        return (
            <p className="text-2xl text-gray-600 font-bold">
                This form isn't ready yet.
                <br/>
                Please contact the author.
            </p>
        )

    return (
        <>
            <Link href="/" className="bg-red-500 rounded-full shadow-2xl w-fit p-1 active:brightness-75 hover:brightness-95 float-right ml-auto">
                <img src={Cancel} className="w-4 h-4" alt="close form"/>
            </Link>

            <div className="flex gap-2 items-center">
                <p className="w-full font-bold text-2xl">{form.title}</p>
            </div>

            <div className="flex flex-col items-start gap-4">
                <LabelledInput 
                    key={currentField.id}
                    field={currentField}
                    mutateFieldCB={async (fieldId: number, value: string) => {
                        dispatchAction({
                            actionType: "mutate_field",
                            id: fieldId,
                            kind: currentField.kind,
                            value: value,
                            callback: (field) => mutateField(id, field)
                        });
                    }}
                />

                <Paginator fields={formState} id={id} current={Number(props.page)}/>

                <button
                    className="flex items-center p-2 bg-slate-100 shadow-lg rounded-lg gap-2 active:shadow-sm font-bold"
                    onClick={() => {
                        submitAnswers(formState, form)
                    }}
                >
                    Submit
                </button>
            </div>
        </>
    );
}