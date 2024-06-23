"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@components/ui/button";
import React from "react";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "~/lib/utils/uploadthing";
import { type NewProduct } from "~/server/api/routers/product";
import { UploadThingError } from "uploadthing/server";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { AspectRatio } from "@components/ui/aspect-ratio";
import { api } from "~/trpc/react";

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Product name too short" })
        .max(255, { message: "Product name too short" }),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number" })
        .min(0)
        .safe(),
    images: z.array(z.instanceof(File)).min(1).max(8),
});

const CreatePage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    console.log("errors", form.formState.errors);

    const [previewImage, setPreviewImage] = React.useState<string[]>([]);

    const createProduct = api.product.create.useMutation({
        onSuccess: response => {
            console.log("product succesfully created", response);
        },
    });

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log("submit", value);

        try {
            const fileUploadResult = await uploadFiles("thumbnailUploader", {
                files: value.images,
            });
            console.log("uploaded files", fileUploadResult);

            const productToUpload: NewProduct = {
                name: value.name,
                price: value.price,
                imageUrls: fileUploadResult.map(file => file.url),
            };

            console.log("creating product", productToUpload);

            const productCreateResult =
                await createProduct.mutateAsync(productToUpload);

            console.log("everything was succesful", productCreateResult);
        } catch (e) {
            console.log("Error caught", e);
            if (e instanceof UploadThingError) {
                console.log("Error", e.message, e.code, e.data);
                if (e.message.includes("FileSizeMismatch"))
                    form.setError("images", e);
            } else if (e instanceof Error) {
                console.log("unknown error", e);
                form.setError("root", e);
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        maxSize: 4 * 1024 * 1024,
        maxFiles: 6,
        onDrop: (acceptedFiles: File[]) => {
            console.log("files", acceptedFiles);
            setPreviewImage(
                acceptedFiles.map(file => URL.createObjectURL(file)),
            );

            form.setValue("images", acceptedFiles);
        },
    });

    return (
        <div className="grid place-items-center ">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, e =>
                        console.log("error", e),
                    )}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field: { value, ...rest } }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input value={value ?? ""} {...rest} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Upload thumbnails</FormLabel>
                                <FormControl>
                                    <div {...getRootProps()}>
                                        <Input
                                            onChange={field.onChange}
                                            {...getInputProps()}
                                        />
                                        <div className="grid h-32 w-40 place-items-center bg-neutral-400">
                                            Upload file
                                        </div>
                                    </div>
                                </FormControl>
                                {previewImage.length > 0 && (
                                    <div className="flex gap-4 ">
                                        {previewImage.map(imageUrl => (
                                            <AspectRatio
                                                key={imageUrl}
                                                ratio={16 / 9}
                                            >
                                                <Image
                                                    src={imageUrl}
                                                    alt="image"
                                                    layout="fill"
                                                    objectFit="contain"
                                                    onLoad={() =>
                                                        URL.revokeObjectURL(
                                                            imageUrl,
                                                        )
                                                    }
                                                />
                                            </AspectRatio>
                                        ))}
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default CreatePage;
