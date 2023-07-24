import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Tarkov app</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4 ">
          <div className="flex w-full items-center justify-between p-4">
            <header className="justify-self-center">
              <nav>
                <ul className="flex gap-6 font-bold text-slate-200">
                  <li>
                    <Link href="/?page=1">Home</Link>
                  </li>
                  <li>
                    <Link href="/traders">Traders</Link>
                  </li>
                </ul>
              </nav>
            </header>
            <h1 className="justify-self-start text-lg font-extrabold tracking-tight text-white sm:text-2xl">
              Tarkov <span className="text-yellow-600">T3</span> App
            </h1>
          </div>
          <div className="flex w-full flex-col rounded-xl bg-slate-800/10 p-4 text-white">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
