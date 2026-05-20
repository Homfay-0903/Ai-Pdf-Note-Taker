'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAction, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import uuid4 from "uuid4";
import axios from 'axios'
import { toast } from "sonner"
import { useTranslations } from "next-intl"

interface UploadPdfDialogProps {
    isMaxFile: boolean
}

export default function UploadPdfDialog({ isMaxFile }: UploadPdfDialogProps) {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)
    const addFileEntry = useMutation(api.fileStorage.addFileEntryToDb)
    const getFileUrl = useMutation(api.fileStorage.getFileUrl)
    const embeddDocment = useAction(api.myAction.ingest)
    const { user } = useUser()
    const t = useTranslations('dashboard.upload')

    const [file, setFile] = useState<File | undefined>()
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState<string>()
    const [open, setOpen] = useState(false)

    const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        setFile(selectedFile)
    }
    const onUpload = async () => {
        if (!file) return

        setLoading(true)

        const postUrl = await generateUploadUrl()

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        })
        const { storageId } = await result.json()
        const fileId = uuid4()
        const fileUrl = await getFileUrl({ storageId: storageId })

        await addFileEntry({
            fileId: fileId,
            storageId: storageId,
            fileName: fileName ?? t('untitledFile'),
            fileUrl: fileUrl ?? '',
            createdBy: user?.primaryEmailAddress?.emailAddress ?? 'unknown'
        })

        const apiResp = await axios.get('api/pdf-loader?pdfUrl=' + fileUrl)
        await embeddDocment({
            splitText: apiResp.data.result,
            fileId: fileId
        })

        setLoading(false)
        setOpen(false)

        toast(t('fileReady'))
    }
    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} disabled={isMaxFile} className='w-full cursor-pointer'>
                    {t('button')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('dialogTitle')}</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <h2 className="mt-3">{t('selectFile')}</h2>
                            <div className="gap-2 p-3 rounded-md border">
                                <input type="file" accept="application/pdf"
                                    onChange={(event) => onFileSelect(event)} />
                            </div>
                            <div className="mt-2">
                                <label>{t('fileNameLabel')}</label>
                                <Input placeholder={t('fileNamePlaceholder')}
                                    onChange={(e) => setFileName(e.target.value)}>
                                </Input>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t('close')}</Button>
                    </DialogClose>
                    <Button onClick={onUpload}>
                        {loading ?
                            <Loader2 className="animate-spin"></Loader2> : t('upload')
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
