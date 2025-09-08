import "./globals.css";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export const metadata = {
  title: "HelmFinance v2.5",
  description: "Personal finance with auth, Postgres/Prisma, CSV import.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <nav className="container flex items-center gap-6 py-4">
            <Link href="/" className="flex items-center gap-2 navlink">
              <img src="/logo.svg" alt="HelmFinance" width={28} height={28} />
              <span className="font-medium">HelmFinance</span>
            </Link>
            {session && (
              <div className="flex items-center gap-4">
                <Link className="navlink" href="/accounts">Accounts</Link>
                <Link className="navlink" href="/transactions">Transactions</Link>
                <Link className="navlink" href="/budgets">Budgets</Link>
                <Link className="navlink" href="/goals">Goals</Link>
                <Link className="navlink" href="/import">Import</Link>
              </div>
            )}
            <div className="ml-auto">
              {session ? (
                <form action={async () => { 'use server'; await signOut({ redirectTo: '/signin' }); }}>
                  <button className="btn">Sign out</button>
                </form>
              ) : (
                <Link href="/signin" className="btn">Sign in</Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-10 text-sm text-gray-400">
          v2.5 • Next.js + Prisma + NextAuth • CSV import
        </footer>
      </body>
    </html>
  );
}
