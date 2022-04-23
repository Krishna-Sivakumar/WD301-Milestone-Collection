import { useState } from "react";

export default function DynamicForm(props : {
    fields: {id: number, name: string}[]
    setFields: (fields: {id: number, name: string}[]) => void
}) {
    const [state, setState] = useState(() => {
        return [
            ...props.fields,
            {
                id: Number(new Date()),
                name: ""
            }
        ]
    })

    const handleInput = (index : number) => {
        return ((event : React.ChangeEvent<HTMLInputElement>) => {
            setState(state => {
                const strippedFields = state
                    .map(ele => index === ele.id ? {...ele, name: event.target.value} : ele)
                    .reverse()
                    .reduce(
                        (prev, curr) => {
                            if (curr.name.length > 0 || prev.length > 0)
                                return [...prev, curr];
                            else
                                return prev;
                        }, [] as {id: number, name: string}[]
                    )
                    .reverse();

                props.setFields(strippedFields);

                return [
                    ...strippedFields,
                    ...(strippedFields.length === 0 || strippedFields[strippedFields.length - 1].name.length > 0 ? [{id: Number(new Date()), name: ""}] : [])
                ];
            })
        })
    }

    return (
        <div className="flex flex-col gap-2">
            {
                state.map((field) => <input
                    key={field.id}
                    type="text"
                    value={field.name}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full last:opacity-50 last:border-dashed"
                    onChange={handleInput(field.id)}
                />)
            }
        </div>
    )
}