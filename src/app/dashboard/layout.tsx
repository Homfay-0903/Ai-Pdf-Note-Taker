import React from 'react'
import SideBar from './components/SideBar'
import Header from './components/Header';

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
                <Header></Header>
                <div className='p-5'>
                    {children}
                </div>
            </div>
        </div>
    )
}
