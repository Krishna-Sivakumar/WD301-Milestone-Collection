import Field from "./Field";

export default interface FormData {
    id: number,
    title: string,
    fields: Field[]
}