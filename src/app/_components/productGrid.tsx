import { api } from "~/trpc/server";
import React, { type ReactNode } from "react";

export async function ProductGrid() {
    const products = await api.product.getAll();

    console.log(
        "products",
        products.map(p => p.name),
    );

    return (
        <>
            {products.map(p => (
                <p key={p.id}>{p.name}</p>
            ))}
        </>
    );
}
