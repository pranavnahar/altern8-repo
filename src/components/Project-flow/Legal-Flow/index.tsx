import FileUpload from '@/components/FileUpload/FileUpload'
import { Input } from '@/components/ui/input'
import React from 'react'
export const LegalFlow = () => {

    const fileOptions = [
        'Title deed',
        'Sale deed',
    ];

    return (
        <div className="flex mt-5 flex-col gap-10 border p-5">
            {fileOptions.map(label => (
                <FileUpload key={label} onDrop={files => onDrop(files, label)} label={label} />
            ))}
            <button
                type="submit"
                className="p-2 mx-auto w-24 bg-[#1565c0] text-white rounded-3xl m-l-[30px] flex item-center justify-center"
            >
                Next
            </button>
        </div>
    )
}
