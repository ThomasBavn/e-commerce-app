import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import TopNav from "@components/topnav";

export const metadata = {
    title: "Create T3 App",
    description: "Generated by create-t3-app",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <div className="grid h-screen grid-rows-[auto,1fr]">
                    <TopNav />
                    <TRPCReactProvider>
                        <div className="container">{children}</div>
                    </TRPCReactProvider>
                </div>
            </body>
        </html>
    );
}
