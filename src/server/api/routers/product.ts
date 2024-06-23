import { type Product } from "@prisma/client";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export type NewProduct = z.infer<typeof newProductSchema>;

const newProductSchema: z.ZodType<Omit<Product, "id">> = z.object({
    name: z.string().min(1).max(255),
    price: z
        .number()
        .nonnegative("price cannot be negative")
        .safe("too large number entered"),
    imageUrls: z.array(z.string().url()),
});

export const productRouter = createTRPCRouter({
    getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        return ctx.db.product.findFirst({
            where: {
                id: input,
            },
        });
    }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            const products = await ctx.db.product.findMany();

            console.log("PRODUCTS", products);
            return products;
        } catch (e) {
            console.error("ERROR", e);

            return [];
        }
    }),

    create: protectedProcedure
        .input(newProductSchema)
        .mutation(async ({ ctx, input }) => {
            console.log("creating new product", input);
            try {
                const createResponse = await ctx.db.product.create({
                    data: {
                        name: input.name,
                        price: input.price,
                        imageUrls: input.imageUrls,
                    },
                });

                return { result: "success", data: { id: createResponse.id } };
            } catch (e) {
                return { result: "error", message: e };
            }
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.product.delete({
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
                    data: input,
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
