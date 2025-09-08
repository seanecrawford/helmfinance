import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tx = await prisma.transaction.findMany({ where: { userId: session.user.id }, orderBy: { date: "desc" } });
  return NextResponse.json({ transactions: tx });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { accountId, date, category, memo, amount } = body;
  if (!accountId || !date || !category || amount === undefined) return NextResponse.json({ error: "Missing" }, { status: 400 });
  const t = await prisma.transaction.create({ data: { userId: session.user.id, accountId, date: new Date(date), category, memo, amount } });
  return NextResponse.json(t);
}
