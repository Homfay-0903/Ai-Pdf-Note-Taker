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
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function UploadPdfDialog({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)
    const [file, setFile] = useState()
    const [loading, setLoading] = useState(false)

    const onFileSelect = (event) => {
        setFile(event.target.file[0])
    }
    const OnUpload = async () => {
        setLoading(true)

        // Step 1: Get a short-lived upload URL
        const postUrl = await generateUploadUrl();
        // Step 2: POST the file to the URL
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
        });
        const { storageId } = await result.json();
        console.log('id', storageId)

        setLoading(false)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
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
                                <Input placeholder="File Name"></Input>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                    <Button onClick={OnUpload}>
                        {loading ?
                            <Loader2 className="animate-spin"></Loader2> : 'Upload'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
