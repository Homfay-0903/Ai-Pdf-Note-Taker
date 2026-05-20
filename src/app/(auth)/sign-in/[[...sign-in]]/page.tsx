import LanguageSwitcher from '@/components/LanguageSwitcher'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='relative flex items-center justify-center h-screen'>
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            <SignIn />
        </div>
    )
}
