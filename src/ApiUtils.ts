import { APIForm, APIFormField, Pagination, PaginationParams } from "./interfaces/ApiTypes";

const API_BASE_URL = "https://tsapi.coronasafe.live/api"

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT"

export const request = async (endpoint: string, method : RequestMethod, payload : any = {}) => {

    let url;
    if (method === "GET") {
        const requestParams = payload ? `?${Object.keys(payload).map(key => `${key}=${payload[key]}`).join("&")}` : "";
        url = `${API_BASE_URL}${endpoint}/${requestParams}`
    } else {
        url = `${API_BASE_URL}${endpoint}/`
    }

    const token = localStorage.getItem("token");
    const auth = token ?  "Token " + token : "";

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: auth
        },
        ...((payload && method !== "GET") && {body: JSON.stringify(payload)}),
    })

    try {
        const json = await response.json();
        return json;
    } catch(error) {
        return error;
    }
}

export const me = () => {
    return request("/users/me", "GET", {})
}

export const listForms = (pageParams: PaginationParams) => {
    return request("/forms", "GET", )
}

export const getAPIFormFields = async (id: number, setFields: (fields: APIFormField[]) => void) => {
    const paginatedFields : Pagination<APIFormField> = await request(`/forms/${id}/fields`, "GET", {form_pk: id});
    const fields = await paginatedFields.results
    setFields(fields);
}

export const getAPIForm = async (id: number, setForm: (form: APIForm) => void) => {
    const form : APIForm = await request(`/forms/${id}`, "GET", {id: id});
    setForm(form);
}

export const createNewField = async (formId: number, field: {label: string, kind: "TEXT" | "DROPDOWN" | "RADIO" | "GENERIC",}) => {
    return await request(`/forms/${formId}/fields`, "POST", field);
}

export const mutateField = async(formId: number, field: APIFormField) => {
    if (field.id) {
        return await request(`/forms/${formId}/fields/${field.id}`, "PATCH", {
            kind: field.kind,
            label: field.label,
            ...(field.options && {options: field.options}),
            ...(field.value && {value: field.value}),
            ...(field.meta && {meta: field.meta}),
        })
    }
}

export const deleteField = async(formId: number, fieldId: number) => {
    return await request(`/forms/${formId}/fields/${fieldId}`, "DELETE", {form_pk: formId, id: fieldId});
}
