import Image from "next/image";
import { P } from "./ui/typography";
import { type Product } from "@prisma/client";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface Props {
    product?: Product;
}

const ProductCard = ({ product }: Props) => {
    console.log("product", product);

    return product ? (
        <Link href="/product/[id]" as={`/product/${product.id}`}>
            <div className="hover:shadow-lg rounded-md p-1 overflow-hidden duration-75 hover:-translate-y-1">
                <div className="max-w-40 pb-2">
                    {product ? (
                        <Image
                            src={product.imageUrls[0] ?? ""}
                            width={160}
                            height={240}
                            alt="product"
                            objectFit="cover"
                            className="overflow-hidden rounded-sm"
                        />
                    ) : (
                        <Skeleton className="w-[160px] h-[240px]" />
                    )}
                    <div>
                        {!!product ? (
                            <p className="truncate">Isaac Dewhirst</p>
                        ) : (
                            <Skeleton className="w-20 h-4" />
                        )}
                        {!!product ? (
                            <p className="truncate">{product.name}</p>
                        ) : (
                            <Skeleton />
                        )}
                        {!!product ? (
                            <p className="truncate font-semibold text-red-600">
                                {product.price} DKK
                            </p>
                        ) : (
                            <Skeleton />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    ) : (
        <div className=" flex flex-col gap-1">
            <Skeleton className="w-[140px] rounded-sm h-[240px]" />
            <div className="space-y-1">
                <Skeleton className="w-20 h-5" />
                <Skeleton className="w-28 h-5" />
                <Skeleton className="w-16 h-5" />
            </div>
        </div>
    );
};

export default ProductCard;
