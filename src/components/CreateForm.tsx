import React, { useState } from "react";
import { Error, APIForm, validateForm } from "../interfaces/ApiTypes"
import { request } from "../ApiUtils";

export default function CreateForm(props: {
    callback: () => void
}) {
    const [form, setForm] = useState<APIForm>({
        title: "",
        description: "",
        is_public: false
    });
    const [errors, setErrors] = useState<Error<APIForm>>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateForm(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            await request("/forms", "POST", form);
            await props.callback()
        }
    }

    return (
        <div className="w-full max-w-lg divide-y divide-gray-200">
            <h1 className="text-2xl my-2 text-gray-700">Create Form</h1>
            <form className="py-4 grid grid-cols-2 gap-y-2" onSubmit={handleSubmit}>
                    <label htmlFor="title" className={`${errors?.title ? "text-red-500" : ""} font-bold`}>Title</label>
                    <input
                        className="border-2 border-gray-200 rounded-lg p-2 w-full"
                        type="text"
                        name="title"
                        id="title"
                        value={form.title}
                        onChange={handleChange}
                    />
                    {errors?.title && <p className="text-red-500">{errors?.title}</p>}
                    <label htmlFor="description" className={`${errors?.description ? "text-red-500" : ""} font-bold`}>Description</label>
                    <input
                        className="border-2 border-gray-200 rounded-lg p-2 w-full"
                        type="text"
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                    {errors?.title && <p className="text-red-500">{errors?.title}</p>}
                    <label htmlFor="is_public" className="font-bold">Is Public</label>
                    <input
                        type="checkbox"
                        name="is_public"
                        id="is_public"
                        checked={form.is_public}
                        onChange={e =>
                            setForm(state => ({...state, is_public: e.target.checked}))
                        }
                    />
                <input type="submit" value="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full active:brightness-75 hover:brightness-95 py-2 my-2 col-span-2"/>
            </form>
        </div>
    )
}