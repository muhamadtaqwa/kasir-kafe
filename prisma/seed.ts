import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Users
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@kafe.id" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@kafe.id",
      password,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "kasir@kafe.id" },
    update: {},
    create: {
      name: "Kasir 1",
      email: "kasir@kafe.id",
      password,
      role: "KASIR",
    },
  });

  await prisma.user.upsert({
    where: { email: "dapur@kafe.id" },
    update: {},
    create: {
      name: "Dapur 1",
      email: "dapur@kafe.id",
      password,
      role: "DAPUR",
    },
  });

  // Categories
  const kopi = await prisma.category.upsert({
    where: { id: "cat-kopi" },
    update: {},
    create: { id: "cat-kopi", name: "Kopi", icon: "coffee" },
  });

  const makanan = await prisma.category.upsert({
    where: { id: "cat-makanan" },
    update: {},
    create: { id: "cat-makanan", name: "Makanan", icon: "utensils" },
  });

  const minuman = await prisma.category.upsert({
    where: { id: "cat-minuman" },
    update: {},
    create: { id: "cat-minuman", name: "Minuman", icon: "cup-soda" },
  });

  // Products
  await prisma.product.createMany({
    data: [
      { categoryId: kopi.id, name: "Es Kopi Gula Aren", price: 18000 },
      { categoryId: kopi.id, name: "Americano", price: 15000 },
      { categoryId: kopi.id, name: "Cappuccino", price: 20000 },
      { categoryId: makanan.id, name: "Nasi Goreng", price: 25000 },
      { categoryId: makanan.id, name: "Mie Goreng", price: 22000 },
      { categoryId: minuman.id, name: "Es Teh Manis", price: 8000 },
      { categoryId: minuman.id, name: "Air Mineral", price: 5000 },
    ],
    skipDuplicates: true,
  });

  // Tables
  for (let i = 1; i <= 5; i++) {
    await prisma.table.upsert({
      where: { qrCode: `MEJA-${i}` },
      update: {},
      create: {
        name: `Meja ${i}`,
        qrCode: `MEJA-${i}`,
      },
    });
  }

  console.log("Seed selesai ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });