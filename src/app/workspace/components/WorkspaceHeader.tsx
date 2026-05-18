import { UserButton } from '@clerk/nextjs'
import React from 'react'

export default function WorkspaceHeader() {


    return (
        <div className='p-4 flex justify-between shadow-md'>
            <img src={'/logo.svg'} alt="logo" width={100} height={100} />
            <UserButton></UserButton>
        </div>
    )
}
