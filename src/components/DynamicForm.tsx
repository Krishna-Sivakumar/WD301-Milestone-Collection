import { useState } from "react";

export default function DynamicForm(props : {
    fields: string[]
    setFields: (fields: string[]) => void
}) {
    const [state, setState] = useState(() => {
        return [
            ...props.fields,
            ""
        ]
    })

    const handleInput = (index : number) => {
        return ((event : React.ChangeEvent<HTMLInputElement>) => {
            setState(state => {
                const strippedFields = state
                    .map((ele, idx) => index === idx ? event.target.value : ele)
                    .reverse()
                    .reduce(
                        (prev, curr) => {
                            if (curr.length > 0 || prev.length > 0)
                                return [...prev, curr];
                            else
                                return prev;
                        }, [] as string[]
                    )
                    .reverse();

                props.setFields(strippedFields);

                return [
                    ...strippedFields,
                    ...(strippedFields.length === 0 || strippedFields[strippedFields.length - 1].length > 0 ? [""] : [])
                ]
            })
        })
    }

    return (
        <div className="flex flex-col gap-2">
            {
                state.map((field, idx) => <input
                    key={idx}
                    type="text"
                    value={field}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full last:opacity-50 last:border-dashed"
                    onChange={handleInput(idx)}
                />)
            }
        </div>
    )
}