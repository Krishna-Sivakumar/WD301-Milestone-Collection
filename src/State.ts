import FormData from "./interfaces/FormData";

export const getLocalForms: () => FormData[] = () => {
    const formsJSON = localStorage.getItem("forms");
    return formsJSON ? JSON.parse(formsJSON) : [];
}

export const saveLocalForms = (localForms: FormData[]) => {
    localStorage.setItem("forms", JSON.stringify(localForms))
}