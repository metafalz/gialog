import Head from "next/head";
import Link from "next/link";
import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 dark:text-gray-100">
      <Head>
        <title>note ――書け、抜け、学べ。</title>
      </Head>
      <header className="container mx-auto max-w-2xl px-8 py-12">
        <nav>
          <p>
            <Link href="/">
              <a className="font-bold text-gray-900 visited:text-gray-900 dark:text-gray-300 dark:visited:text-gray-300">
                no+e
              </a>
            </Link>
          </p>
        </nav>
      </header>
      <main className="container mx-auto max-w-2xl px-8 py-12 shadow-md bg-white dark:bg-gray-900">
        {children}
      </main>
      <footer className="container mx-auto max-w-2xl px-8 py-12 text-sm">
        <nav>
          <ul className="flex flex-row gap-6 justify-center">
            <li>
              <Link href="/">
                <a className="text-gray-900 visited:text-gray-900 dark:text-gray-300 dark:visited:text-gray-300">
                  Home
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
