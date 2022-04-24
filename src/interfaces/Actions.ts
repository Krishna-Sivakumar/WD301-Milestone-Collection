import { APIFormField } from "./ApiTypes";

interface AddFieldAction {
    actionType: "add_field"
    label: string
    kind: "TEXT" | "DROPDOWN" | "RADIO" | "GENERIC"
}

interface RemoveFieldAction {
    actionType: "remove_field"
    id: number
}

interface BaseMutateAction {
    actionType: "mutate_field"
    id: number
    callback: (field: APIFormField) => void
}

interface MutateDropdownAction extends BaseMutateAction {
    kind: "DROPDOWN"
    label?: string
    value?: string
    options?: string[]
}

interface MutateRadioAction extends BaseMutateAction  {
    kind: "RADIO"
    value?: string
    label?: string
    options?: string[]
}

interface MutateTextAction extends BaseMutateAction  {
    kind: "TEXT"
    label?: string
    value?: string
}

interface MutateGenericAction extends BaseMutateAction  {
    kind: "GENERIC"
    type?: string
    label?: string
    value?: string
}

interface SetFieldsAction {
    actionType: "set_fields",
    fields: APIFormField[]
}

type MutateFieldAction = MutateDropdownAction | MutateGenericAction | MutateTextAction | MutateRadioAction;

export type Action = AddFieldAction | RemoveFieldAction | MutateFieldAction | SetFieldsAction;

export const reducer = (state : APIFormField[], action : Action) => {
    switch(action.actionType) {
        case "add_field": {
            const field: APIFormField = (() => {
                const base = { id: Number(new Date()), label: action.label }
                switch (action.kind) {
                    case "TEXT":
                    case "GENERIC":
                        return {
                            ...base,
                            kind: action.kind,
                            value: ""
                        }
                    case "RADIO":
                    case "DROPDOWN":
                        return {
                            ...base,
                            kind: action.kind,
                            value: "",
                            options: []
                        }
                }
            })()
            return [
                ...state,
                field
            ].sort((a, b) => {
                if (a.id && b.id)
                    return a.id - b.id
                else
                    return 0
            })
        }
        case "remove_field": {
            return state.filter(field => field.id !== action.id)
        }
        case "mutate_field": {
            const field : APIFormField = (() => {
                const target : APIFormField = state.filter(field => field.id === action.id)[0];
                switch(action.kind) {
                    case "TEXT":
                    case "GENERIC":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.value && {value: action.value}),
                        } as APIFormField : target;
                    case "DROPDOWN":
                    case "RADIO":
                        return (target.id === action.id && target.kind === action.kind) ? {
                            ...target,
                            ...(action.label && {label: action.label}),
                            ...(action.value && {value: action.value}),
                            ...(action.options && {options: action.options}),
                        } as APIFormField : target;
                }
            })()
            action.callback(field);
            return [
                ...state.filter(field => field.id !== action.id),
                field
            ].sort((a, b) => {
                if (a.id && b.id)
                    return a.id - b.id
                else
                    return 0
            })
        }
        case "set_fields":
            return action.fields.sort((a, b) => {
                if (a.id && b.id)
                    return a.id - b.id
                else
                    return 0
            })
    }
}