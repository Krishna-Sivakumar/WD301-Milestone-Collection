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
        switch (curr.kind) {
            case "range":
            case "textarea":
            case "input": 
                return {
                    ...prev,
                    [curr.id]: curr.value ?? ""
                } as Record<number, string>
            case "multi":
            case "radio":
            default:
                return {
                    ...prev,
                    [curr.id]: curr.options
                }
        }
    }, {});

    const preview: FormData = {
        ...formSchema,
        fields: formSchema.fields.map(field => {
            switch (field.kind) {
                case "range":
                case "textarea":
                case "input": return {
                    ...field,
                    value: prefilledValueSet[field.id] ?? "" // if field is already filled in preview, use that value. Else keep it blank.
                }
                case "multi": return {
                    ...field, // todo
                }
                default:
                case "radio": return {
                    ...field, // todo
                }
            }
        })
    }

    saveLocalPreviews([...localPreviews.filter(form => form.id !== preview.id), preview]);
    return preview;
}