import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const pdfUrl = 'https://curious-lemur-430.convex.cloud/api/storage/21eb95e8-7607-4cd9-8752-94a7910148d1'
export async function GET(req) {
    const response = await fetch(pdfUrl)
    const data = await response.blob()
    const loader = new WebPDFLoader(data)
    const docs = await loader.load()

    let pdfContext = ''
    docs.forEach(doc => {
        pdfContext += doc.pageContent
    })

    return NextResponse.json({ result: pdfContext })
}