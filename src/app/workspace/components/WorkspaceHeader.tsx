import LanguageSwitcher from '@/components/LanguageSwitcher'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

interface WorkspaceHeaderProps {
    fileName: string
}

export default function WorkspaceHeader({ fileName }: WorkspaceHeaderProps) {
    return (
        <div className='p-4 flex justify-between shadow-md'>
            <Link href={'/dashboard'}>
                <img src={'/logo.svg'} alt="logo" width={100} height={100} />
            </Link>
            <h2 className='font-bold'>{fileName}</h2>
            <div className='flex items-center gap-2'>
                <LanguageSwitcher />
                <UserButton></UserButton>
            </div>

        </div>
    )
}
