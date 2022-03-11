
interface Field {
    id: number,
    type?: string,
    label: string,
    value?: string
};

export default function LabelledInput(props: {field: Field, removeFieldCB: (id: number) => void, mutateFieldCB: (id: number, value: string) => void}) {
    return (
        <div key={props.field.id}>
            <label className="font-semibold capitalize">{props.field.label}</label>
            <div className="flex gap-2 items-center">
                <input
                    type={props.field.type ?? "text"}
                    value={props.field.value}
                    className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize" 
                    onChange={e => {
                        props.mutateFieldCB(props.field.id, e.target.value)
                    }}
                />
                <input
                    type="button"
                    value="Remove"
                    onClick={() => props.removeFieldCB(props.field.id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:brightness-75 hover:brightness-95"
                />
            </div>
        </div>
    );
}