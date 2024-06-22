"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { api } from "~/trpc/server";
import { ourFileRouter } from "../api/uploadthing/core";
import { createRouteHandler } from "uploadthing/server";
import { POST } from "../api/uploadthing/route";
import { NextRequest } from "next/server";

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

    const [previewImage, setPreviewImage] = React.useState<string[]>([]);

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log("submit", value);

    };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },

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
                                    <FormDescription className="flex gap-4 h-40">
                                        {previewImage.map(imageUrl => (
                                            <img
                                                key={imageUrl}
                                                src={imageUrl}
                                                onLoad={() =>
                                                    URL.revokeObjectURL(
                                                        imageUrl,
                                                    )
                                                }
                                            />
                                        ))}
                                    </FormDescription>
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
