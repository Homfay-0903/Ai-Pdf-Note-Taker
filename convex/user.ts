import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
    args: {
        userName: v.string(),
        email: v.string(),
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
                imageUrl: args.imageUrl
            })

            return 'Inserted new user...'
        }

        return 'User already exists!'
    }
})