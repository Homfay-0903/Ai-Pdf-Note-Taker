import React from 'react'
import SideBar from './components/SideBar'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div className='md:w-64 h-screen fixed'>
                <SideBar></SideBar>
            </div>
            <div className='md:ml-64'>
                {children}
            </div>
        </div>
    )
}
