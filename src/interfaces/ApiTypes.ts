export interface APIForm {
    id?: number,
    title: string,
    description?: string
    is_public?: boolean
    created_by?: number,
    created_date?: string,
    modified_date?: string,
}

export interface APIFormField {
    id?: number
    label: string
    kind: "TEXT" | "DROPDOWN" | "RADIO" | "GENERIC"
    options?: string[]
    value?: string
    meta?: {description: string}
}

export interface APIAnswer {
    form_field: number
    value: string
}

export interface APISubmission {
    answers: APIAnswer[]
    id?: number
    form?: APIForm
    created_date?: string
}

export type Error<T> = Partial<Record<keyof T, string>>

export const validateForm = (form: APIForm) => {
    const errors : Error<APIForm> = {}
    if (form.title.length < 1) {
        errors.title = "Title is required";
    } if (form.title.length > 100) {
        errors.title = "Title must be less than 100 characters";
    }
    return errors
}

export type Pagination<T> = {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export type PaginationParams = {
    offset: number
    limit: number
}
