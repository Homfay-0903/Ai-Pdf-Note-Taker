import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import React from 'react'
import UploadPdfDialog from './UploadPdfDialog'

export default function SideBar() {
    return (
        <div className='shadow-md h-screen p-7'>
            <img src={'/logo.svg'} alt="logo" width={150} height={150} />

            <div className='mt-10'>
                <UploadPdfDialog></UploadPdfDialog>

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
                <Progress value={33}></Progress>
                <p className='text-sm mt-1'>2 out of 5 Pdf Upload</p>
                <p className='text-sm text-gray-400 mt-2'>Upgrate to Upload more Pdf</p>
            </div>
        </div>
    )
}