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
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-4 ">
          <div className="mb-q flex w-full flex-col-reverse items-center justify-between gap-4 md:flex-row md:p-4">
            <header className="justify-self-center">
              <nav>
                <ul className="flex gap-4 font-semibold text-slate-200">
                  <li>
                    <Link
                      href="/?page=1"
                      className="rounded-md bg-slate-500 bg-opacity-20 p-2 hover:bg-slate-900/50 focus:bg-slate-900/50 active:bg-slate-900/50"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/traders"
                      className="rounded-md bg-slate-500 bg-opacity-20 p-2 hover:bg-slate-900/50 active:bg-slate-900/50"
                    >
                      Traders
                    </Link>
                  </li>
                </ul>
              </nav>
            </header>
            <h1 className="justify-self-start text-3xl font-extrabold tracking-tight text-white md:text-2xl">
              Tarkov <span className="text-yellow-600">T3</span> App
            </h1>
          </div>
          <div className="flex w-full flex-col text-white md:p-4">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
