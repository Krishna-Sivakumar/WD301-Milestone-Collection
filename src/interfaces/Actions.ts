import Field from "./Field"
import FormData from "./FormData"

interface AddGeneralFieldAction {
    actionType: "add_field"
    label: string
    kind: "radio" | "multi" | "textarea" | "range"
}

interface AddInputFieldAction {
    actionType: "add_field"
    label: string
    kind: "input"
    type: string
}

export type AddFieldAction = AddInputFieldAction | AddGeneralFieldAction

interface RemoveFieldAction {
    actionType: "remove_field"
    id: number
}

interface BaseMutateAction {
    actionType: "mutate_field"
    id: number
}

interface MutateRangeAction extends BaseMutateAction {
    kind: "range"
    value?: string
    min?: string
    max?: string
    label?: string
}

interface MutateMultiAction extends BaseMutateAction {
    kind: "multi"
    label?: string
    options?: {id: number, name: string}[]
    check?: {id: number, checked: boolean}
}

interface MutateRadioAction extends BaseMutateAction  {
    kind: "radio"
    value?: string
    label?: string
    options?: {id: number, name: string}[]
}

interface MutateTextareaAction extends BaseMutateAction  {
    kind: "textarea"
    label?: string
    value?: string
}

interface MutateInputAction extends BaseMutateAction  {
    kind: "input"
    type?: string
    label?: string
    value?: string
}

interface MutateTitleAction {
    actionType: "mutate_title",
    title: string
}

type MutateFieldAction = MutateMultiAction | MutateRangeAction | MutateRadioAction | MutateTextareaAction | MutateInputAction

export type Action = AddFieldAction | RemoveFieldAction | MutateFieldAction | MutateTitleAction

export const reducer = (state : FormData, action : Action) => {
    switch(action.actionType) {
        case "add_field": {
            const field : Field = (() => {
                const base = { id: Number(new Date()), label: action.label };
                switch(action.kind) {
                    case "input":
                        return {
                            ...base,
                            kind: "input",
                            type: action.type,
                            value: ""
                        } as Field
                    case "multi":
                        return {
                            ...base,
                            kind: "multi",
                            options: [],
                            selected: []
                        } as Field
                    case "radio":
                        return {
                            ...base,
                            kind: "radio",
                            options: []
                        } as Field
                    case "range":
                        return {
                            ...base,
                            kind: "range",
                            max: "100",
                            min: "0"
                        } as Field
                    case "textarea":
                        return {
                            ...base,
                            kind: "textarea",
                            value: ""
                        } as Field
                }
            })() 
            return {
                ...state,
                fields: [
                    ...state.fields,
                    field
                ]
            }
        }
        case "remove_field": {
            return {
                ...state,
                fields: state.fields.filter(field => field.id !== action.id)
            }
        }
        case "mutate_field": {
            const field: Field = (() => {
                const target : Field = state.fields.filter(field => field.id === action.id)[0];

                switch(action.kind) {
                    case "input":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.type && {type: action.type}),
                            ...(action.value && {value: action.value}),
                        } as Field : target

                    case "multi":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.options && {options: action.options}),
                            ...(action.check && {
                                selected: [
                                    ...target.selected.filter(ele => ele !== action.check?.id),
                                    ...(action.check?.checked ? [action.check?.id] : [])
                                ]
                            })
                        } as Field : target

                    case "radio":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.value && {value: action.value}),
                            ...(action.options && {options: action.options}),
                        } as Field : target

                    case "range":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.value && {value: action.value}),
                            ...(action.min && {min: action.min}),
                            ...(action.max && {max: action.max}),
                        } as Field : target

                    case "textarea":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.value && {value: action.value}),
                        } as Field : target

                }
            })()
            return {
                ...state,
                fields: [
                    ...state.fields.filter(field => field.id !== action.id),
                    field
                ].sort((a, b) => a.id - b.id)
            }
        }
        case "mutate_title":
            return {
                ...state,
                title: action.title
            }
    }
}