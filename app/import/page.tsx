"use client";
import Papa from "papaparse";
import { useState } from "react";

type Row = { date: string; account: string; category: string; memo?: string; amount: string };

export default function ImportPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setRows(results.data)
    });
  }

  async function onImport() {
    setStatus("Importing...");
    const res = await fetch("/api/transactions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows })
    });
    if (res.ok) setStatus("Imported successfully");
    else setStatus("Import failed");
  }

  return (
    <div className="card">
      <h1 className="h1 mb-4">Import Transactions (CSV)</h1>
      <input type="file" accept=".csv" onChange={onFile} className="mb-3" />
      <p className="text-sm text-gray-400 mb-2">Expected headers: date, account, category, memo, amount</p>
      <button className="btn btn-primary" onClick={onImport} disabled={!rows.length}>Import {rows.length} rows</button>
      {status && <p className="mt-3 text-sm">{status}</p>}
      {rows.length>0 && (
        <div className="mt-6 overflow-auto">
          <table className="table min-w-[600px]">
            <thead><tr><th>Date</th><th>Account</th><th>Category</th><th>Memo</th><th>Amount</th></tr></thead>
            <tbody>
              {rows.slice(0,50).map((r,i)=>(
                <tr key={i}><td>{r.date}</td><td>{r.account}</td><td>{r.category}</td><td className="text-gray-400">{r.memo}</td><td>{r.amount}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
