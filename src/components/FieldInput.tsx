import DynamicForm from "../components/DynamicForm"
import { APIFormField } from "../interfaces/ApiTypes"

export default function FieldInput(
    props: {
        field: APIFormField,
        mutateFieldNameCB: (id: number, value: string) => void,
        mutateOptionsCB: (id: number, value: string[]) => void,
        removeFieldCB: (id: number) => void
    }
) {

    const field = props.field;

    return (
        <>
            <hr className="my-2"/>
            <div className="grid grid-cols-4 place-items-center gap-4 items-center">
                <input
                    type="text"
                    value={props.field.label}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize"
                    onChange={e => {
                        field.id && props.mutateFieldNameCB(field.id, e.target.value)
                    }}
                    placeholder="Name"
                />
                <p className="capitalize font-semibold">{props.field.kind.toLowerCase()}</p>
                <input
                        type="button"
                        value="Remove"
                        onClick={() => field.id && props.removeFieldCB(field.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95"
                />
            </div>
            {
                (() => {
                    const field = props.field;
                    switch(field.kind) {
                        case "RADIO":
                        case "DROPDOWN":
                            return <details>
                                <summary>Expand to fill in options</summary>
                                <DynamicForm
                                    fields={field.options || []}
                                    setFields={
                                        (fields: string[]) => {
                                            field.id && props.mutateOptionsCB(field.id, fields)
                                        }
                                    }
                                />
                            </details>
                    }
                })()
            }
        </>
    )
}