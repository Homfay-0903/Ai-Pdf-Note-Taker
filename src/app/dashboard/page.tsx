'use client'

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface FileType {
    _id: string
    _creationTime: number
    fileId: string
    storageId: string
    fileName: string
    fileUrl: string
    createdBy: string
}

export default function Dashboard() {
    const { user } = useUser()
    const userFiles = useQuery(api.fileStorage.getUserFiles, {
        userEmail: (user?.primaryEmailAddress?.emailAddress) as string
    }) as FileType[] | undefined

    return (
        <div>
            <h2 className='font-medium text-3xl'>Workspace</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
                {!userFiles ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <p className="mt-3 text-gray-500">Loading files...</p>
                    </div>
                ) : userFiles.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-gray-500">No files uploaded yet</p>
                        <p className="text-sm text-gray-400 mt-1">Upload your first PDF to get started</p>
                    </div>
                ) : (
                    userFiles.map((file) => (
                        <Link key={file._id} href={'/workspace/' + file.fileId}>
                            <div key={file._id} className="flex p-5 shadow-md rounded-md 
                            flex-col items-center justify-center border cursor-pointer hover:scale-105 transition-all">
                                <img src={'/pdf.png'} alt="pdf" width={50} height={50} />
                                <h2 className="mt-3 font-medium text-lg">{file.fileName}</h2>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}