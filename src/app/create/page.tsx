"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
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
import { ourFileRouter } from "../api/uploadthing/core";
import { UploadDropzone } from "~/lib/utils/uploadthing";

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

    const onSubmit = (value: z.infer<typeof formSchema>) => {
        console.log("submit", value);

        const uploader = ourFileRouter.thumbnailUploader;

        if (value.images.length > 0) return;

        uploader(value.images[0]!);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        onDropAccepted: (files: File[]) => {
            form.setValue("images", files);
        },
        onDropRejected: (err) => {
            console.error("new error", err);
            if (!err[0]) return;

            switch (err?.[0].errors[0]?.code) {
                case "file-invalid-type":
                    form.setError("images", {
                        message: "One or more files have an invalid file format",
                    });
                    break;
            }
        },
    });

    return (
        <div className="grid place-items-center">
            <div className="h-60 w-40 ">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, (e) =>
                            console.log("error", e),
                        )}
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
                                    <FormLabel />
                                    <FormControl>
                                        <div {...getRootProps()}>
                                            <input onChange={field.onChange} {...getInputProps()} />
                                            <div className="grid h-32 w-40 place-items-center bg-neutral-400">
                                                Upload file
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;
