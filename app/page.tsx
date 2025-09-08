import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function fmt(n: any) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n));
}
function pct(n: number) { return `${(n*100).toFixed(1)}%`; }

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    return (
      <div className="card">
        <h1 className="h1">Welcome to HelmFinance</h1>
        <p className="text-gray-300 mt-2">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const accounts = await prisma.account.findMany({ where: { userId } });
  const start = new Date();
  start.setDate(1);
  const end = new Date(start);
  end.setMonth(end.getMonth()+1);
  const transactions = await prisma.transaction.findMany({ where: { userId, date: { gte: start, lt: end } }, orderBy: { date: "desc" } });
  const budgets = await prisma.budget.findMany({ where: { userId } });
  const goals = await prisma.goal.findMany({ where: { userId } });

  const totalBalance = accounts.reduce((s,a)=> s + Number(a.balance), 0);
  const monthSpend = transactions.reduce((s,t)=> s + (Number(t.amount) < 0 ? -Number(t.amount) : 0), 0);
  const budgetTotal = budgets.reduce((s,b)=> s + Number(b.limit), 0);
  const budgetUsed = budgetTotal ? monthSpend / budgetTotal : 0;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <section className="card">
        <h1 className="h1 mb-2">Total Balance</h1>
        <p className="text-3xl font-semibold">{fmt(totalBalance)}</p>
        <p className="text-sm text-gray-400 mt-2">Across {accounts.length} accounts</p>
      </section>
      <section className="card">
        <h2 className="h2 mb-2">This Month Spend</h2>
        <p className="text-3xl font-semibold">{fmt(monthSpend)}</p>
        <p className="text-sm text-gray-400 mt-2">Budget used: <span className="badge">{pct(budgetUsed)}</span></p>
      </section>
      <section className="card">
        <h2 className="h2 mb-2">Goals Progress</h2>
        <ul className="space-y-2">
          {goals.map(g => (
            <li key={g.id} className="flex justify-between items-center">
              <span>{g.name}</span>
              <span className="badge">{pct(Number(g.saved)/Number(g.target))}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:col-span-2 card">
        <h2 className="h2 mb-4">Recent Transactions</h2>
        <table className="table">
          <thead><tr><th>Date</th><th>Account</th><th>Category</th><th>Memo</th><th className="text-right">Amount</th></tr></thead>
          <tbody>
            {transactions.slice(0,8).map(t => (
              <tr key={t.id}>
                <td>{new Date(t.date).toISOString().slice(0,10)}</td>
                <td>{accounts.find(a => a.id===t.accountId)?.name}</td>
                <td>{t.category}</td>
                <td className="text-gray-400">{t.memo}</td>
                <td className="text-right">{fmt(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="h2 mb-2">Budgets</h2>
        <ul className="space-y-2">
          {budgets.map(b => {
            const spent = transactions.filter(t=> t.category===b.category)
              .reduce((s,t)=> s + (Number(t.amount) < 0 ? -Number(t.amount) : 0), 0);
            const used = Math.min(spent / Number(b.limit), 1);
            return (
              <li key={b.id}>
                <div className="flex justify-between">
                  <span>{b.category}</span>
                  <span className="text-gray-400">{fmt(spent)} / {fmt(b.limit)}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full mt-1">
                  <div className="h-2 rounded-full bg-white/60" style={{ width: `${used*100}%`}} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
