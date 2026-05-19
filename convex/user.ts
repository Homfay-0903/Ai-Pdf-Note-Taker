import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
    args: {
        userName: v.string(),
        email: v.string(),
        upgrate: v.boolean(),
        imageUrl: v.string()
    },
    handler: async (ctx, args) => {
        //用户已存在
        const user = await ctx.db.query('users')
            .filter((q) => q.eq(q.field('email'), args.email))
            .collect()

        //用户未存在
        if (user?.length === 0) {
            await ctx.db.insert('users', {
                userName: args.userName,
                email: args.email,
                upgrate: false,
                imageUrl: args.imageUrl
            })

            return 'Inserted new user...'
        }

        return 'User already exists!'
    }
})

export const userUpgratePlan = mutation({
    args: {
        email: v.string()
    },

    handler: async (ctx, args) => {
        const result = await ctx.db.query('users')
            .filter((q) => q.eq(q.field('email'), args.email)).collect()

        if (result) {
            await ctx.db.patch(result[0]._id, { upgrate: true })
            return 'success'
        }

        return 'error'
    }
})

export const getUserInfo = query({
    args: {
        email: v.optional(v.string())
    },

    handler: async (ctx, args) => {
        if (!args.email) {
            return
        }

        const result = await ctx.db.query('users')
            .filter((q) => q.eq(q.field('email'), args.email)).collect()

        return result[0]
    }
})