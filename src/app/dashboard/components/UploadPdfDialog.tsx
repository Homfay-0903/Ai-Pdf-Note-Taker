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

export default function UploadPdfDialog() {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)
    const addFileEntry = useMutation(api.fileStorage.addFileEntryToDb)
    const getFileUrl = useMutation(api.fileStorage.getFileUrl)
    const embeddDocment = useAction(api.myAction.ingest)
    const { user } = useUser()

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

        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl()

        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
        })
        const { storageId } = await result.json()
        const fileId = uuid4()
        const fileUrl = await getFileUrl({ storageId: storageId })

        // Step 3: Save the newly allocated storage id to the database
        await addFileEntry({
            fileId: fileId,
            storageId: storageId,
            fileName: fileName ?? 'Untitled File',
            fileUrl: fileUrl ?? '',
            createdBy: user?.primaryEmailAddress?.emailAddress ?? 'unknown'
        })

        //step 4
        const apiResp = await axios.get('api/pdf-loader?pdfUrl=' + fileUrl)
        await embeddDocment({
            splitText: apiResp.data.result,
            fileId: fileId
        })

        setLoading(false)
        setOpen(false)
    }
    return (
        <Dialog open={open}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className='w-full'>+ Upload Pdf</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Pdf file</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <h2 className="mt-3">select a file to Upload</h2>
                            <div className="gap-2 p-3 rounded-md border">
                                <input type="file" accept="application/pdf"
                                    onChange={(event) => onFileSelect(event)} />
                            </div>
                            <div className="mt-2">
                                <label>File Name *</label>
                                <Input placeholder="File Name"
                                    onChange={(e) => setFileName(e.target.value)}>
                                </Input>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button onClick={onUpload}>
                        {loading ?
                            <Loader2 className="animate-spin"></Loader2> : 'Upload'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}