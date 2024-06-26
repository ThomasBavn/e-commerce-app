import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { H3, P } from "./_components/ui/typography";
import { Button } from "./_components/ui/button";
import ProductCard from "@components/productCard";
import { ProductGrid } from "@components/productGrid";

export default function Home() {
    return (
        <main className="min-h-screen ">
            <ProductGrid />

            {/* <Showcase /> */}
        </main>
    );
}

async function Showcase() {
    const hello = await api.post.hello({ text: "from tRPC" });
    const session = await getServerAuthSession();
    return (
        <div className="flex flex-col items-center gap-2">
            <H3>{hello ? hello.greeting : "Loading tRPC query..."}</H3>

            <div className="flex flex-col items-center justify-center gap-4">
                {session && <P>Logged in as {session.user?.name}</P>}
                <Button asChild>
                    <Link
                        href={
                            session ? "/api/auth/signout" : "/api/auth/signin"
                        }
                    >
                        {session ? "Sign out" : "Sign in"}
                    </Link>
                </Button>
            </div>
        </div>
    );
}

async function CrudShowcase() {
    const session = await getServerAuthSession();
    if (!session?.user) return null;

    const latestPost = await api.post.getLatest();

    return (
        <div className="w-full max-w-xs">
            {latestPost ? (
                <P className="truncate">
                    Your most recent post: {latestPost.name}
                </P>
            ) : (
                <P>You have no posts yet.</P>
            )}

            <CreatePost />
        </div>
    );
}
