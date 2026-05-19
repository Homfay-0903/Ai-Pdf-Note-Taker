import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'

interface WorkspaceHeaderProps {
    fileName: string
}

export default function WorkspaceHeader({ fileName }: WorkspaceHeaderProps) {
    return (
        <div className='p-4 flex justify-between shadow-md'>
            <img src={'/logo.svg'} alt="logo" width={100} height={100} />
            <h2 className='font-bold'>{fileName}</h2>
            <div className='flex items-center gap-2'>
                <Button>Save</Button>
                <UserButton></UserButton>
            </div>

        </div>
    )
}
