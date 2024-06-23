"use client";

import React from "react";
import ProductCard from "./productCard";
import { api } from "~/trpc/react";

export function ProductGrid() {
    const products = api.product.getAll.useQuery();

    console.log(
        "products",
        products.data?.map(p => p.name),
    );

    return (
        <div className="flex flex-wrap gap-4">
            {products.data?.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
    );
}
