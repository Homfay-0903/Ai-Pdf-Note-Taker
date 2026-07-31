import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveChatHistory = mutation({
    args: {
        fileId: v.string(),
        messages: v.any(),
        createdBy: v.string()
    },

    handler: async (ctx, args) => {
        const record = await ctx.db.query('chatHistory')
            .filter((q) => q.eq(q.field('fileId'), args.fileId)).collect()

        if (record.length === 0) {
            await ctx.db.insert('chatHistory', {
                fileId: args.fileId,
                messages: args.messages,
                createdBy: args.createdBy
            })
        } else {
            await ctx.db.patch(record[0]._id, {
                messages: args.messages
            })
        }
    }
})

export const getChatHistory = query({
    args: {
        fileId: v.string()
    },

    handler: async (ctx, args) => {
        const result = await ctx.db.query('chatHistory')
            .filter((q) => q.eq(q.field('fileId'), args.fileId)).collect()

        return result[0]?.messages ?? []
    }
})
