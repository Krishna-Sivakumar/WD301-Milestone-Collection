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
        mutateRangeCB: (id: number, value: {max?: string, min?: string}) => void,
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
                    const field = props.field;
                    switch(field.kind) {
                        case "range":
                            return <details>
                                <summary>Expand to fill in details</summary>
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <label>Minimum</label>
                                        <input
                                            value={field.min}
                                            onChange={e =>{
                                                props.mutateRangeCB(props.field.id, {min: e.target.value})
                                            }}
                                            className="border-2 border-gray-200 rounded-lg p-2 w-full"
                                            placeholder="Minimum"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <label>Maximum</label>
                                        <input
                                            value={field.max}
                                            onChange={e =>{
                                                props.mutateRangeCB(props.field.id, {max: e.target.value})
                                            }}
                                            className="border-2 border-gray-200 rounded-lg p-2 w-full"
                                            placeholder="Maximum"
                                        />
                                    </div>
                                </div>
                            </details>
                        case "radio":
                            return <details>
                                <summary>Expand to fill in options</summary>
                                <DynamicForm
                                    fields={field.options}
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
                                    fields={field.options.map(ele => ele.name)}
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