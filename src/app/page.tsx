import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { H3, P } from "./_components/ui/typography";
import { Button } from "./_components/ui/button";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="flex flex-col items-center gap-2">
        <H3 className="text-2xl ">
          {hello ? hello.greeting : "Loading tRPC query..."}
        </H3>

        <div className="flex flex-col items-center justify-center gap-4">
          <P className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </P>
          <Button asChild>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </Button>
        </div>
      </div>

      <CrudShowcase />
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <P className="truncate">Your most recent post: {latestPost.name}</P>
      ) : (
        <P>You have no posts yet.</P>
      )}

      <CreatePost />
    </div>
  );
}
