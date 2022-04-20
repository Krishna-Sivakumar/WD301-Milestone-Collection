interface BaseField {
    id: number
    type?: string
    label: string
}

interface InputField extends BaseField {
    kind: "input"
    value?: string
}

interface RadioField extends BaseField {
    kind: "radio"
    options: string[]
    value?: string
}

interface MultiSelectField extends BaseField {
    kind: "multi"
    options: {id: number, name: string}[]
    selected: number[]
}

interface TextAreaField extends BaseField {
    kind: "textarea"
    value?: string
}

interface RangeField extends BaseField {
    kind: "range"
    value?: string
    min: string
    max: string
}

type Field = InputField | RadioField | MultiSelectField | TextAreaField | RangeField;

export default Field;
