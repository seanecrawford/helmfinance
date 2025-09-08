import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type Row = { date: string; account: string; category: string; memo?: string; amount: string };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rows } = await req.json() as { rows: Row[] };
  const userId = session.user.id as string;

  // Map account names to ids (create if missing)
  const accounts = await prisma.account.findMany({ where: { userId } });
  const map = new Map(accounts.map(a => [a.name.toLowerCase(), a.id]));

  const createTx: any[] = [];
  for (const r of rows) {
    if (!r.date || !r.account || !r.category || r.amount===undefined) continue;
    let accountId = map.get(r.account.toLowerCase());
    if (!accountId) {
      const a = await prisma.account.create({ data: { userId, name: r.account, type: "checking", balance: 0 } });
      map.set(r.account.toLowerCase(), a.id);
      accountId = a.id;
    }
    createTx.push({
      userId,
      accountId,
      date: new Date(r.date),
      category: r.category,
      memo: r.memo || null,
      amount: Number(r.amount),
    });
  }

  if (createTx.length) await prisma.transaction.createMany({ data: createTx });
  return NextResponse.json({ imported: createTx.length });
}
