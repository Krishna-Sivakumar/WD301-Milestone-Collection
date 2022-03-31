import { Link } from "raviger";

export default function Header(props: {title: string, mutateTitleCB: (value: string) => void, id: number}) {
    return (
        <div className="flex gap-4 items-center">
            <Link href={`/preview/${props.id}`} className="flex items-center p-2 bg-slate-100 shadow-lg rounded-lg gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Preview
            </Link>
            <input
                type="text" 
                value = {props.title}
                onChange={e => props.mutateTitleCB(
                    e.target.value
                )}
                className="border-2 border-gray-200 rounded-lg p-2 w-full"
                placeholder="Title"
            />
        </div>
    );
}