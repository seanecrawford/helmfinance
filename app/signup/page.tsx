"use client";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password })
    });
    if (res.ok) setStatus("Account created. You can sign in.");
    else setStatus("Failed to create account.");
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="h1 mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" type="submit">Sign up</button>
      </form>
      {status && <p className="text-sm mt-3">{status}</p>}
    </div>
  );
}
