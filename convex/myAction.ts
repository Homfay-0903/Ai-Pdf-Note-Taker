'use node'

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";
import { action } from "./_generated/server.js";
import { v } from "convex/values";

export const ingest = action({
    args: {
        splitText: v.any(),
        fileId: v.string()
    },

    handler: async (ctx, args) => {
        await ConvexVectorStore.fromTexts(
            args.splitText,
            args.splitText.map(() => ({ fileId: args.fileId })),
            new ZhipuAIEmbeddings({
                apiKey: '1bb8eb8f9c18492c84db6ebda5a5dd2c.sTZl6pG4ZOKEhU69',
            }),
            { ctx }
        );

        return 'completed...'
    },
});

export const search = action({
    args: {
        query: v.string(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const vectorStore = new ConvexVectorStore(
            new ZhipuAIEmbeddings({
                apiKey: '1bb8eb8f9c18492c84db6ebda5a5dd2c.sTZl6pG4ZOKEhU69',
            }),
            { ctx }
        );

        const allResults = await vectorStore.similaritySearch(args.query, 5)
        const resultOne = allResults
            .filter(q => q.metadata.fileId === args.fileId)

        return JSON.stringify(resultOne)
    },
});