import Image from "next/image";
import { P } from "./ui/typography";
import { type Product } from "@prisma/client";

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    console.log("product", product);
    return (
        <div className="flex flex-col gap-1 max-w-40">
            <div className="relative h-60 w-40">
                <Image
                    src={product.imageUrls[0] ?? ""}
                    alt="product"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <p>Isaac Dewhirst</p>
            <p>{product.name}</p>
            <p className="text-red-800">{product.price}DKK</p>
        </div>
    );
};

export default ProductCard;
