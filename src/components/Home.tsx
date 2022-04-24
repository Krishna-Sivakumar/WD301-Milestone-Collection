import { useEffect, useState } from "react";
import BinIcon from "../icons/BinIcon";
import OpenIcon from "../icons/OpenIcon";
import { Link, navigate, useQueryParams } from "raviger";

import { APIForm, Pagination } from "../interfaces/ApiTypes"

import Modal from "./Modal";
import CreateForm from "./CreateForm";

import {listForms, request} from "../ApiUtils";
import { toast } from "react-toastify";

const fetchForms = async (setForms: React.Dispatch<React.SetStateAction<APIForm[]>>) => {
    try {
        const data: Pagination<APIForm> = await listForms({offset: 5, limit: 10});
        setForms(data.results)
    } catch(error) {
        console.log(error)
    }
}

const deleteForm = async (id?: number) => {
    if (id) {
        return await request(`/forms/${id}`, "DELETE", {});
    }
}

export function Home() {

    const [state, setState] = useState<APIForm[]>([]);
    const [searchString, setSearchString] = useState("");
    const [newForm, setNewForm] = useState(false);

    const [queryParams, setQueryParams] = useQueryParams();
    const {search=""} = queryParams;

    useEffect(() => {
        fetchForms(setState);
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    })

    const filteredState = search ? state.filter(form => form.title.toLowerCase().indexOf(search.toLowerCase()) !== -1) : state;

    return (
        <div className="flex flex-col gap-3">
            <form action="" method="GET" className="flex gap-3" onSubmit={e => {
                e.preventDefault();
                setQueryParams({search: searchString});
            }}>
                <input value={searchString} onChange={e => setSearchString(e.target.value)} type="text" name="search" className="grow border-2 border-gray-100 rounded-lg p-2"/>
                <input type="submit" className="capitalize text-white font-bold bg-gradient-to-r from-blue-500 to-blue-700 p-2 rounded-lg" value="filter" />
            </form>
            {filteredState.map(
                form => (
                    <div className="flex gap-2 items-center" key={form.id}>
                        <span className="font-bold mr-auto">{form.title}</span>
                        <Link
                            className = "bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit active:brightness-75 hover:brightness-95 p-2 flex items-center gap-2 capitalize"
                            href = {`/form/${form.id}`}
                        >
                            <OpenIcon/>
                            open
                        </Link>
                        <button
                            className = "bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-xl text-white font-bold active:brightness-75 hover:brightness-95 p-2 flex items-center gap-2 capitalize"
                            onClick={
                                async () => {
                                    toast.error("Deleting Form...")
                                    await deleteForm(form.id); await fetchForms(setState)
                                }
                            }
                        >
                            <BinIcon/>
                            delete
                        </button>
                    </div>
                )
            )}

            {
                state.length === 0 &&
                <p className="text-gray-500 font-bold text-2xl">No forms created :(</p>
            }

            <button
                className = "bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-full active:brightness-75 hover:brightness-95 py-2 my-2"
                onClick={
                    e => {
                        setNewForm(true)
                    }
                }
            >
                New
            </button>
            <Modal open={newForm} closeCB={() => setNewForm(false)}>
                <CreateForm callback={async () => {
                    toast.success("Creating form")
                    await setNewForm(false);
                    await fetchForms(setState);
                }}/>
            </Modal>
        </div>
    );
}