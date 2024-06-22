import { MOCK_IMAGE_URLS } from "../mockData";
import Image from "next/image";
import { P } from "./ui/typography";

const image = MOCK_IMAGE_URLS[0];

type Product = {
    id: number;
    title: string;
    company: string;
    price: number;
    newPrice?: number;
};

const ProdcutCard = () => {
    return (
        <div className="flex flex-col gap-1">
            <div className="relative h-60 w-44">
                <Image
                    src={image}
                    alt="product"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <p>Isaac Dewhirst</p>
            <p>FASHION SUIT - Suit - bordeaux</p>
            <p className="text-red-800">731.00DKK</p>
        </div>
    );
};

export default ProdcutCard;
