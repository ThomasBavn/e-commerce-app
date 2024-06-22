import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

const f = createUploadthing();

type Output<T extends object> =
    | { result: "error"; message: Readonly<string> }
    | { result: "success"; data: T };

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await getServerAuthSession();

            // If you throw, the user will not be able to upload
            if (!session?.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { url: file.url };
        }),
    thumbnailUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 6 },
    })
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await getServerAuthSession();

            // If you throw, the user will not be able to upload
            if (!session?.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id };
        })
        .onUploadError(err => {
            return { result: "error", message: err.error.message };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { result: "success", data: { url: file.url } };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
