import { UserButton } from '@clerk/nextjs'

export default function Header() {
    return (
        <div className='flex justify-end shadow-sm p-4'>
            <UserButton></UserButton>
        </div>
    )
}
