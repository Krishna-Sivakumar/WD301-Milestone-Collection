import Field from "../interfaces/Field";

export default function LabelledInput(props: {canRemove?: boolean, field: Field, removeFieldCB: (id: number) => void, mutateFieldCB: (id: number, value: string, options?: {id: number, name: string, selected: boolean}[]) => void}) {

    const generateField = (field : Field) => {
        switch(field.kind) {
            case "range":
                return (
                    <input
                        type="range"
                        value={field.value}
                        max={field.max}
                        min={field.min}
                        className="w-full"
                        onChange={
                            e => props.mutateFieldCB(field.id, e.target.value)
                        }
                    />
                )
            case "input":
                return (
                    <input
                        type={field.type ?? "text"}
                        value={field.value}
                        className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize" 
                        onChange={e => {
                            props.mutateFieldCB(field.id, e.target.value)
                        }}
                    />
                )
            case "textarea":
                return (
                    <textarea
                        cols={30}
                        rows={10}
                        value={field.value}
                        className="border-2 border-gray-200 rounded-lg w-full p-2"
                        onChange={e => {
                            props.mutateFieldCB(field.id, e.target.value)
                        }}
                    >
                    </textarea>
                )
            case "radio":
                return (
                    <fieldset className="grid grid-cols-2 gap-4">
                        {
                            field.options.map(
                                option => <>
                                    <label>{option}</label>
                                    <input type="radio" className="place-self-center" name={field.label} value={option} onChange={
                                        e => {
                                            props.mutateFieldCB(field.id, e.target.value)
                                        }
                                    } />
                                </>
                            )
                        }
                    </fieldset>
                )
            case "multi":
                return (
                    <fieldset className="grid grid-cos-2 gap-4">
                        {
                            field.options.sort((a,b) => a.name.localeCompare(b.name)).map(
                                option => <>
                                    <input type="checkbox" checked={option.id in field.selected} onChange={ e => {
                                        /*
                                        props.mutateFieldCB(field.id, "", [
                                            ...field.options.filter(op => op.id !== option.id),
                                            {
                                                ...option,
                                                selected: e.target.checked
                                            }
                                        ])
                                        */
                                    }}  />
                                    <label>{option.name}</label>
                                </>
                            )
                        }
                    </fieldset>
                )
        }
    }

    return (
        <div className="w-full">
            <label className="font-semibold capitalize">{props.field.label}</label>
            <div className="flex gap-2 items-center">
                {generateField(props.field)}
                { props.canRemove && <input
                    type="button"
                    value="Remove"
                    onClick={() => props.removeFieldCB(props.field.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95"
                />}
            </div>
        </div>
    );
}