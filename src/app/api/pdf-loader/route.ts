import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const runtime = "nodejs";

const OCR_ENABLED = process.env.OCR_ENABLED !== "false";
const OCR_DETECT_IMAGES = process.env.OCR_DETECT_IMAGES !== "false";
const ZHIPU_API_KEY =
    process.env.NEXT_PUBLIC_ZHIPUAI_KEY || process.env.ZHIPUAI_KEY || "";
const GLM_VISION_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const OCR_MODEL = "glm-4v-flash";
const OCR_PROMPT = `请识别这张图片中的所有文字。要求：
1. 逐字提取所有可见文字，包括标题、正文、表格、脚注、页眉页脚；
2. 保持原有的阅读顺序和段落结构；
3. 只输出识别到的文字内容本身，不要添加任何解释、说明、评论或前言。`;
const MAX_RENDER_DIMENSION = 4096;
const MAX_PNG_BYTES = 4.5 * 1024 * 1024;

async function loadPdfjs() {
    const canvas: any = await import("@napi-rs/canvas");
    if (!globalThis.DOMMatrix) globalThis.DOMMatrix = canvas.DOMMatrix;
    if (!globalThis.Path2D) globalThis.Path2D = canvas.Path2D;
    if (!globalThis.ImageData) globalThis.ImageData = canvas.ImageData;

    const canvasFactory = {
        create(width: number, height: number) {
            const c = canvas.createCanvas(width, height);
            return { canvas: c, context: c.getContext("2d") };
        },
        reset(ctx: any, width: number, height: number) {
            ctx.canvas.width = width;
            ctx.canvas.height = height;
        },
        destroy() {
            // no-op, let GC collect the canvas
        },
    };

    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.js");
    return { pdfjs, canvasFactory };
}

async function pageHasImages(page: any, imageOperators: number[]): Promise<boolean> {
    const ops = await page.getOperatorList();
    return ops.fnArray.some((fn: number) => imageOperators.includes(fn));
}

async function renderPageToPngBase64(page: any, canvasFactory: any): Promise<string | null> {
    try {
        const base = page.getViewport({ scale: 1 });
        let scale = Math.min(2, MAX_RENDER_DIMENSION / Math.max(base.width, base.height));
        let viewport = page.getViewport({ scale });
        let { canvas, context } = canvasFactory.create(
            Math.ceil(viewport.width),
            Math.ceil(viewport.height)
        );
        await page.render({ canvasContext: context, viewport }).promise;
        let png = canvas.toBuffer("image/png");

        if (png.length > MAX_PNG_BYTES && scale > 0.5) {
            scale = scale / 2;
            viewport = page.getViewport({ scale });
            const second = canvasFactory.create(
                Math.ceil(viewport.width),
                Math.ceil(viewport.height)
            );
            await page.render({ canvasContext: second.context, viewport }).promise;
            png = second.canvas.toBuffer("image/png");
        }
        return png.toString("base64");
    } catch (error) {
        console.error("PDF 页面渲染失败:", error);
        return null;
    }
}

async function ocrPageText(page: any, canvasFactory: any): Promise<string> {
    if (!ZHIPU_API_KEY) return "";

    const base64 = await renderPageToPngBase64(page, canvasFactory);
    if (!base64) return "";

    const payload = {
        model: OCR_MODEL,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: OCR_PROMPT },
                    { type: "image_url", image_url: { url: `data:image/png;base64,${base64}` } },
                ],
            },
        ],
        temperature: 0.1,
        max_tokens: 1024,
    };

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const res = await fetch(GLM_VISION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ZHIPU_API_KEY}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const body = await res.text();
                console.error("OCR 调用失败:", res.status, body.slice(0, 300));
                return "";
            }
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            return typeof content === "string" ? content : "";
        } catch (error) {
            console.error("OCR 请求异常:", error);
            if (attempt === 0) continue;
        }
    }
    return "";
}

export async function GET(req: Request) {
    try {
        const reqUrl = req.url;
        const { searchParams } = new URL(reqUrl);
        const pdfUrl = searchParams.get("pdfUrl") ?? "";
        if (!pdfUrl) return NextResponse.json({ result: [] });

        const response = await fetch(pdfUrl);
        const data = await response.blob();
        const arrayBuffer = await data.arrayBuffer();

        const { pdfjs, canvasFactory } = await loadPdfjs();
        const pdfDoc = await pdfjs.getDocument({
            data: new Uint8Array(arrayBuffer),
            useSystemFonts: true,
            canvasFactory,
        }).promise;

        const imageOperators = [
            pdfjs.OPS.paintImageXObject,
            pdfjs.OPS.paintImageXObjectRepeat,
            pdfjs.OPS.paintJpegXObject,
            pdfjs.OPS.paintInlineImageXObject,
            pdfjs.OPS.paintImageMaskXObject,
        ];

        const pageTexts: string[] = [];
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);

            const textContent = await page.getTextContent();
            const extractedText = textContent.items
                .filter((item: any) => typeof item.str === "string")
                .map((item: any) => item.str)
                .join("")
                .trim();

            const needsOcr =
                OCR_ENABLED &&
                (extractedText.length === 0 ||
                    (OCR_DETECT_IMAGES && (await pageHasImages(page, imageOperators))));

            let pageText = extractedText;
            if (needsOcr) {
                const ocrText = await ocrPageText(page, canvasFactory);
                if (ocrText.trim()) {
                    pageText = [extractedText, ocrText.trim()].filter(Boolean).join("\n\n");
                }
            }
            pageTexts.push(pageText);
        }

        const pdfTextContent = pageTexts.join("\n\n");

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
        const output = await splitter.createDocuments([pdfTextContent]);

        return NextResponse.json({ result: output.map((doc) => doc.pageContent) });
    } catch (error) {
        console.error("PDF 解析失败:", error);
        return NextResponse.json(
            { error: "PDF 解析失败", result: [] },
            { status: 500 }
        );
    }
}
