'use client'

import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

interface FileType {
    _id: string
    _creationTime: number
    fileId: string
    storageId: string
    fileName: string
    fileUrl: string
    createdBy: string
}

export default function SideBar() {
    const { user } = useUser()
    const userFiles = useQuery(api.fileStorage.getUserFiles, {
        userEmail: (user?.primaryEmailAddress?.emailAddress) as string
    }) as FileType[] | undefined


    return (
        <div className='shadow-md h-screen p-7'>
            <img src={'/logo.svg'} alt="logo" width={150} height={150} />

            <div className='mt-10'>
                <UploadPdfDialog isMaxFile={userFiles?.length === 5 ? true : false}></UploadPdfDialog>

                <div className='flex gap-2 items-center p-3 mt-5
                hover:bg-slate-100 rounded-lg cursor-pointer'>
                    <Layout></Layout>
                    <h2>Workspace</h2>
                </div>
                <div className='flex gap-2 items-center p-3 mt-1
                hover:bg-slate-100 rounded-lg cursor-pointer'>
                    <Shield></Shield>
                    <h2>Upgrate</h2>
                </div>
            </div>

            <div className='absolute bottom-24 w-[80%]'>
                <Progress value={((userFiles?.length as number) / 5) * 100}></Progress>
                <p className='text-sm mt-1'>{userFiles?.length ?? '0'} out of 5 Pdf Upload</p>
                <p className='text-sm text-gray-400 mt-2'>Upgrate to Upload more Pdf</p>
            </div>
        </div>
    )
}