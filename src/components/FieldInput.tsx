import Field from "../interfaces/Field"
import DynamicForm from "../components/DynamicForm"

export default function FieldInput(
    props: {
        field: Field,
        mutateFieldNameCB: (id: number, value: string) => void,
        mutateFieldTypeCB: (id: number, value: string) => void,
        mutateFieldOptionsCB: (id: number, value:
            {kind: "radio", content: string[]} |
            {kind: "multi", content: {id: number, name: string}[]}
        ) => void,
        removeFieldCB: (id: number) => void
    }
) {
    return (
        <>
            <hr className="my-2"/>
            <div className="grid grid-cols-4 place-items-center gap-4 items-center">
                <input
                    type="text"
                    value={props.field.label}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize"
                    onChange={e => {
                        props.mutateFieldNameCB(props.field.id, e.target.value)
                    }}
                    placeholder="Name"
                />
                {
                    (() => {
                        switch(props.field.kind) {
                            case "input":
                                return (
                                    <select
                                        value={props.field.type}
                                        onChange={e => {
                                            props.mutateFieldTypeCB(props.field.id, e.target.value)
                                        }}
                                        className="border-2 border-gray-200 rounded-lg p-2 w-full"
                                        placeholder="Type"
                                    >
                                        <option value="text">text</option>
                                        <option value="date">date</option>
                                        <option value="time">time</option>
                                        <option value="datetime-local">date and time</option>
                                        <option value="number">number</option>
                                    </select>
                                )
                        }
                    })()
                }
                <p>{props.field.kind}</p>
                <input
                        type="button"
                        value="Remove"
                        onClick={() => props.removeFieldCB(props.field.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95"
                />
            </div>
            {
                (() => {
                    switch(props.field.kind) {
                        case "radio":
                            return <details>
                                <summary>Expand to fill in options</summary>
                                <DynamicForm
                                    fields={props.field.options}
                                    setFields={
                                        (fields: string[]) => 
                                            props.mutateFieldOptionsCB(props.field.id, {kind: "radio", content: fields})
                                    }
                                />
                            </details>
                        case "multi":
                            return <details>
                                <summary>Expand to fill in options</summary>
                                <DynamicForm
                                    fields={props.field.options.map(ele => ele.name)}
                                    setFields={
                                        (fields: string[]) => {
                                            props.mutateFieldOptionsCB(
                                                props.field.id,
                                                {kind: "multi", content: fields.map(ele => ({
                                                    id: Number(new Date()),
                                                    name: ele
                                                }))}
                                            )
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