import { UserButton } from '@clerk/nextjs'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Header() {
    return (
        <div className='flex justify-end items-center gap-3 shadow-sm p-4'>
            <LanguageSwitcher />
            <UserButton></UserButton>
        </div>
    )
}
