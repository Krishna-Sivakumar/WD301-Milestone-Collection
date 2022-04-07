import FormData from "./interfaces/FormData";

export const getLocalForms: () => FormData[] = () => {
    const formsJSON = localStorage.getItem("forms");
    return formsJSON ? JSON.parse(formsJSON) : [];
}

export const saveLocalForms = (localForms: FormData[]) => {
    localStorage.setItem("forms", JSON.stringify(localForms))
}

export const getLocalPreviews: () => FormData[] = () => {
    const previewJSON = localStorage.getItem("previews");
    return previewJSON ? JSON.parse(previewJSON) : [];
}

export const saveLocalPreviews = (localPreviews: FormData[]) => {
    localStorage.setItem("previews", JSON.stringify(localPreviews));
}

export const previewState: (id: number) => FormData = (id: number) => {
    const localForms = getLocalForms();
    const localPreviews = getLocalPreviews();

    const empty: FormData = {
        id: 0,
        title: "",
        fields: []
    }

    const formSchema = localForms.filter(form => form.id === id)[0] ?? empty;
    const oldPreview = localPreviews.filter(form => form.id === id)[0] ?? empty;

    if (formSchema.fields.length === 0) {
        saveLocalPreviews(localPreviews.filter(form => form.id !== id)); // remove preview data if form doesn't exist
        return empty;
    }

    // Collect filled fields in a hashet
    const prefilledValueSet : Record<number, string> = oldPreview.fields.reduce((prev,  curr) => {
        const ret : Record<number, string> = {
            ...prev,
            [curr.id]: curr.value ?? ""
        };
        return ret;
    }, {});

    const preview: FormData = {
        ...oldPreview,
        fields: formSchema.fields.map(field => ({
            ...field,
            value: prefilledValueSet[field.id] ?? "" // if field is already filled in preview, use that value. Else keep it blank.
        }))
    }

    saveLocalPreviews([...localPreviews.filter(form => form.id !== preview.id), preview]);
    return preview;
}