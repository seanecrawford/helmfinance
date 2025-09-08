import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("helmpass", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@helmfinance.app" },
    update: {},
    create: { email: "demo@helmfinance.app", name: "Demo", password },
  });

  const checking = await prisma.account.create({
    data: { userId: user.id, name: "Everyday Checking", type: "checking", balance: 4250.23 }
  });
  const savings = await prisma.account.create({
    data: { userId: user.id, name: "High-Yield Savings", type: "savings", balance: 12850.75 }
  });
  const credit = await prisma.account.create({
    data: { userId: user.id, name: "CashBack Credit", type: "credit", balance: -342.88 }
  });

  await prisma.transaction.createMany({
    data: [
      { userId: user.id, accountId: checking.id, date: new Date("2025-09-05"), category: "Groceries", memo: "Lidl", amount: -72.17 },
      { userId: user.id, accountId: checking.id, date: new Date("2025-09-06"), category: "Dining", memo: "Pizza night", amount: -28.90 },
      { userId: user.id, accountId: checking.id, date: new Date("2025-09-02"), category: "Income", memo: "Contract work", amount: 1800.00 },
      { userId: user.id, accountId: credit.id,   date: new Date("2025-09-03"), category: "Transport", memo: "U-Bahn pass", amount: -49.00 },
      { userId: user.id, accountId: savings.id,  date: new Date("2025-09-01"), category: "Interest", memo: "Monthly interest", amount: 18.42 },
      { userId: user.id, accountId: checking.id, date: new Date("2025-09-07"), category: "Utilities", memo: "Electricity", amount: -63.55 },
      { userId: user.id, accountId: checking.id, date: new Date("2025-09-08"), category: "Groceries", memo: "Rewe", amount: -45.11 }
    ]
  });

  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: "Groceries", limit: 450 },
      { userId: user.id, category: "Dining", limit: 200 },
      { userId: user.id, category: "Transport", limit: 120 },
      { userId: user.id, category: "Utilities", limit: 250 },
    ]
  });

  await prisma.goal.createMany({
    data: [
      { userId: user.id, name: "Emergency Fund", target: 12000, saved: 7800 },
      { userId: user.id, name: "New Laptop", target: 2000, saved: 650 },
    ]
  });

  console.log("Seed complete. Demo login: demo@helmfinance.app / helmpass");
}

main().finally(() => prisma.$disconnect());
