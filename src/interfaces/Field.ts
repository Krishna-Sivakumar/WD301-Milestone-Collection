export interface BaseField {
    id: number
    type?: string
    label: string
}

export interface InputField extends BaseField {
    kind: "input"
    value?: string
}

export interface RadioField extends BaseField {
    kind: "radio"
    options: string[]
    value?: string
}

export interface MultiSelectField extends BaseField {
    kind: "multi"
    options: {id: number, name: string}[]
    selected: number[]
}

export interface TextAreaField extends BaseField {
    kind: "textarea"
    value?: string
}

export interface RangeField extends BaseField {
    kind: "range"
    value?: string
    min: string
    max: string
}

type Field = InputField | RadioField | MultiSelectField | TextAreaField | RangeField;

export default Field;
