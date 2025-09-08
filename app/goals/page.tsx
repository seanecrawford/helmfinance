import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function fmt(n: any) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n)); }
function pct(n: number) { return `${(n*100).toFixed(1)}%`; }

export default async function GoalsPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const goals = await prisma.goal.findMany({ where: { userId } });
  return (
    <div className="card">
      <h1 className="h1 mb-4">Goals</h1>
      <table className="table">
        <thead><tr><th>Name</th><th>Target</th><th>Saved</th><th>Progress</th></tr></thead>
        <tbody>
          {goals.map(g => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td className="text-right">{fmt(g.target)}</td>
              <td className="text-right">{fmt(g.saved)}</td>
              <td><span className="badge">{pct(Number(g.saved)/Number(g.target))}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
