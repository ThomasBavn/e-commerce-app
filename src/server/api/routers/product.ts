import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
    get: publicProcedure
        .input(z.object({ id: z.number().optional() }))
        .query(async ({ ctx, input }) => {
            if (input.id) {
                return ctx.db.product.findFirst({
                    where: {
                        id: input.id,
                    },
                });
            }
            return ctx.db.product.findMany();
        }),

    create: protectedProcedure
        .input(
            z.object({
                newProduct: z.object({
                    name: z.string().min(1).max(255),
                    price: z
                        .number()
                        .nonnegative("price cannot be negative")
                        .safe("too large number entered"),
                }),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.product.create({
                data: {
                    name: input.newProduct.name,
                    price: input.newProduct.price,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.product.delete({
                where: {
                    id: input.id,
                },
            });
        }),

    upsert: protectedProcedure
        .input(
            z.object({
                id: z.number().optional(),
                newProduct: z.object({
                    name: z.string().min(1).max(255),
                    price: z
                        .number()
                        .nonnegative("price cannot be negative")
                        .safe("too large number entered"),
                }),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (input.id) {
                return ctx.db.product.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.newProduct.name,
                        price: input.newProduct.price,
                    },
                });
            }
            return ctx.db.product.create({
                data: {
                    name: input.newProduct.name,
                    price: input.newProduct.price,
                },
            });
        }),

    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),

    getLatest: protectedProcedure.query(({ ctx }) => {
        return ctx.db.post.findFirst({
            orderBy: { createdAt: "desc" },
            where: { createdBy: { id: ctx.session.user.id } },
        });
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});