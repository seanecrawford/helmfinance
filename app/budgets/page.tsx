import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function fmt(n: any) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n)); }

export default async function BudgetsPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const budgets = await prisma.budget.findMany({ where: { userId } });
  return (
    <div className="card">
      <h1 className="h1 mb-4">Budgets</h1>
      <table className="table">
        <thead><tr><th>Category</th><th className="text-right">Limit</th></tr></thead>
        <tbody>
          {budgets.map(b => (
            <tr key={b.id}>
              <td>{b.category}</td>
              <td className="text-right">{fmt(b.limit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
