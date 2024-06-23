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

    const skeletons = Array.from({ length: 8 }).map((_, i) => (
        <ProductCard key={i} />
    ));

    return (
        <div className="flex flex-wrap gap-4">
            {products.data
                ? products.data.map(p => <ProductCard key={p.id} product={p} />)
                : skeletons}
        </div>
    );
}
