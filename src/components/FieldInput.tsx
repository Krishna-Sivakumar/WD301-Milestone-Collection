interface Field {
    id: number,
    type?: string,
    label: string,
    value?: string
};

export default function FieldInput(
    props: {
        field: Field,
        mutateFieldNameCB: (id: number, value: string) => void,
        mutateFieldTypeCB: (id: number, value: string) => void,
        removeFieldCB: (id: number) => void
    }
) {
    return (
        <div className="flex gap-4">
            <input
                type="text"
                value={props.field.label}
                className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize"
                onChange={e => {
                    props.mutateFieldNameCB(props.field.id, e.target.value)
                }}
                placeholder="Name"
            />
            <input
                type="text"
                value={props.field.type}
                className="border-2 border-gray-200 rounded-lg p-2 w-full"
                onChange={e => {
                    props.mutateFieldTypeCB(props.field.id, e.target.value)
                }}
                placeholder="Type"
            />
            <input
                    type="button"
                    value="Remove"
                    onClick={() => props.removeFieldCB(props.field.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95"
                />
        </div>
    )
}