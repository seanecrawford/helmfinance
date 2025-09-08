import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function fmt(n: any) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n)); }

export default async function TransactionsPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const tx = await prisma.transaction.findMany({ where: { userId }, orderBy: { date: "desc" } });
  const accounts = await prisma.account.findMany({ where: { userId } });
  return (
    <div className="card">
      <h1 className="h1 mb-4">Transactions</h1>
      <table className="table">
        <thead><tr><th>Date</th><th>Account</th><th>Category</th><th>Memo</th><th className="text-right">Amount</th></tr></thead>
        <tbody>
          {tx.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.date).toISOString().slice(0,10)}</td>
              <td>{accounts.find(a=>a.id===t.accountId)?.name}</td>
              <td>{t.category}</td>
              <td className="text-gray-400">{t.memo}</td>
              <td className="text-right">{fmt(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
