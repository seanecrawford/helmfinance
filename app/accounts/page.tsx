import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function fmt(n: any) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n)); }

export default async function AccountsPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const accounts = await prisma.account.findMany({ where: { userId } });
  return (
    <div className="card">
      <h1 className="h1 mb-4">Accounts</h1>
      <table className="table">
        <thead><tr><th>Name</th><th>Type</th><th className="text-right">Balance</th></tr></thead>
        <tbody>
          {accounts.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td className="text-gray-400">{a.type}</td>
              <td className="text-right">{fmt(a.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
