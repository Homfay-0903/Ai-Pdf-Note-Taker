'use client'

import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

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
    const pathChoosed = usePathname()
    const userInfo = useQuery(api.user.getUserInfo, {
        email: user?.primaryEmailAddress?.emailAddress as string
    })

    const userFiles = useQuery(api.fileStorage.getUserFiles, {
        userEmail: (user?.primaryEmailAddress?.emailAddress) as string
    }) as FileType[] | undefined


    return (
        <div className='shadow-md h-screen p-7'>
            <img src={'/logo.svg'} alt="logo" width={150} height={150} />

            <div className='mt-10'>
                <UploadPdfDialog isMaxFile={(userFiles?.length as number) >= 5 && !userInfo?.upgrate ? true : false}>
                </UploadPdfDialog>

                <Link href={'/dashboard'}>
                    <div className={`flex gap-2 items-center p-3 mt-5
                hover:bg-slate-100 rounded-lg cursor-pointer
                ${pathChoosed === '/dashboard' && 'bg-slate-200'}`}>
                        <Layout></Layout>
                        <h2>Workspace</h2>
                    </div>
                </Link>

                <Link href={'/dashboard/upgrate'}>
                    <div className={`flex gap-2 items-center p-3 mt-5
                hover:bg-slate-100 rounded-lg cursor-pointer
                ${pathChoosed === '/dashboard/upgrate' && 'bg-slate-200'}`}>
                        <Shield></Shield>
                        <h2>Upgrate</h2>
                    </div>
                </Link>
            </div>

            {!userInfo?.upgrate ? (
                <div className="absolute bottom-24 w-[80%]">
                    <Progress
                        value={((userFiles?.length as number) / 5) * 100}
                    ></Progress>
                    <p className="text-sm mt-1">
                        {userFiles?.length ?? "0"} out of 5 Pdf Upload
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Upgrate to Upload more Pdf
                    </p>
                </div>
            ) : (
                <div className='absolute bottom-24'>
                    <p className="text-sm mt-1">you are Unlimited user!</p>
                </div>
            )}
        </div>
    )
}