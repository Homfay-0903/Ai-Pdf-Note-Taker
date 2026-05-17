import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const pdfUrl = 'https://curious-lemur-430.convex.cloud/api/storage/21eb95e8-7607-4cd9-8752-94a7910148d1'

export async function GET(req: Request) {
    //step1
    const response = await fetch(pdfUrl)
    const data = await response.blob()
    const loader = new WebPDFLoader(data)
    const docs = await loader.load()

    let pdfTextContent = ''
    docs.forEach(doc => {
        pdfTextContent += doc.pageContent
    })

    //step2
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 20 })
    const output = await splitter.createDocuments([pdfTextContent])

    let splitterList: string[] = []
    output.forEach(doc => {
        splitterList.push(doc.pageContent)
    })
    return NextResponse.json({ result: splitterList })
}