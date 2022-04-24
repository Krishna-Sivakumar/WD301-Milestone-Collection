import { APIFormField } from "../interfaces/ApiTypes";
import React from "react";


export default function LabelledInput(props: {
        field: APIFormField, 
        mutateFieldCB: (id: number, value: string) => void,
    },
    ) {

    const generateField = (field : APIFormField) => {
        switch(field.kind) {
            case "GENERIC":
                return (
                    <input
                        type="text"
                        value={field.value}
                        className="border-2 border-gray-200 rounded-lg p-2 w-full" 
                        onChange={e => {
                            field.id && props.mutateFieldCB(field.id, e.target.value)
                        }}
                    />
                )
            case "TEXT":
                return (
                    <textarea
                        value={field.value}
                        className="border-2 border-gray-200 rounded-lg p-2 w-full"
                        rows={2}
                        onChange={e => {
                            field.id && props.mutateFieldCB(field.id, e.target.value)
                        }}
                    />
                )
            case "RADIO":
                return (
                    <fieldset className="grid grid-cols-2 gap-4">
                        {
                            field.options?.map(
                                option => <>
                                    <label key={`${option}-label`}>{option}</label>
                                    <input
                                        type="radio"
                                        defaultChecked={field.value === option}
                                        className="place-self-center"
                                        name={field.label}
                                        key={`${option}-radio`}
                                        value={option} onChange={e => {field.id && props.mutateFieldCB(field.id, e.target.value)}
                                    } />
                                </>
                            )
                        }
                    </fieldset>
                )
            case "DROPDOWN":
                return (
                    <select
                        className="border-2 border-gray-200 rounded-lg p-2 w-full capitalize"
                        value={field.value}
                        onChange={e => {field.id && props.mutateFieldCB(field.id, e.target.value)}}
                    >
                        {
                            field.options?.map(
                                ele => <option key={ele} value={ele}>{ele}</option>
                            )
                        }
                    </select>
                )
        }
    }

    return (
        <div className="w-full" key={props.field.id}>
            <label className="font-semibold capitalize">{props.field.label}</label>
            <div className="flex gap-2 items-center">
                {generateField(props.field)}
            </div>
        </div>
    );
}