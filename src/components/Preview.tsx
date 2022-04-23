import { useEffect, useReducer } from "react"
import Field from "../interfaces/Field";

import LabelledInput from "./LabelledInput";
import Cancel from "../cancel.svg";
import { previewState, getLocalPreviews, saveLocalPreviews } from "../State";
import { Link } from "raviger";

import {reducer} from "../interfaces/Actions"

interface FormData {
    id: number,
    title: string,
    fields: Field[]
}

const savePreview = (currentState: FormData) => {
    const localPreviews = getLocalPreviews();
    const updatedLocalPreviews = localPreviews.map(form => (
        form.id === currentState.id ? currentState : form
    ));
    saveLocalPreviews(updatedLocalPreviews);
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

export default function Preview(props: {id: string, page: string}) {
    const id = Number(props.id)
    const [formState, dispatchAction] = useReducer(reducer, null, () => previewState(id))

    useEffect(() => {
        const oldTitle = document.title;
        document.title = `${oldTitle} | ${formState.title}`;

        return () => {
            document.title = oldTitle;
        }
    }, [formState.title])

    useEffect(() => {
        let timeout = setTimeout(() => {
            savePreview(formState);
        }, 200);


        return () => {
            clearTimeout(timeout);
        }
    }, [formState])

    const currentField = formState.fields[Number(props.page)];

    if (formState.fields.length === 0)
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
                <p className="w-full font-bold text-2xl">{formState.title}</p>
            </div>

            <div className="flex flex-col items-start gap-4">
                <LabelledInput 
                    key={currentField.id}
                    field={currentField}
                    mutateFieldCB={(id: number, value: string) => dispatchAction({
                        actionType: "mutate_field",
                        id: id,
                        kind: currentField.kind,
                        value: value
                    })}
                    mutateOptionsCB={(id: number, value: number, checked: boolean) => dispatchAction({
                        actionType: "mutate_field",
                        id: id,
                        kind: "multi",
                        check: {
                            id: value,
                            checked: checked
                        }
                    })}
                />

                <Paginator fields={formState.fields} id={id} current={Number(props.page)}/>
            </div>
        </>
    );
}