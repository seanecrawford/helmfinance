"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    // next-auth handles redirect; errors via URL param not handled here
  }
  return (
    <div className="max-w-md mx-auto card">
      <h1 className="h1 mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">Sign in</button>
      </form>
      <p className="mt-3 text-sm text-gray-400">No account? <Link href="/signup" className="link">Create one</Link></p>
      <p className="mt-3 text-sm text-gray-400">Demo: demo@helmfinance.app / helmpass (after seeding)</p>
    </div>
  );
}
