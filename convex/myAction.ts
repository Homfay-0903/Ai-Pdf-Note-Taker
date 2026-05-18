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
            args.fileId as any,
            new ZhipuAIEmbeddings({
                apiKey: '1bb8eb8f9c18492c84db6ebda5a5dd2c.sTZl6pG4ZOKEhU69',
            }),
            { ctx }
        );

        return 'completed...'
    },
});