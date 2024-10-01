import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const Categories = [
  "食費",
  "水道光熱費",
  "家賃",
  "娯楽",
  "衣服・美容",
  "日用品",
  "病院代",
  "交通費",
  "その他",
];

async function main() {
  console.log("Start Seeding...");

  // カテゴリーの作成
  Categories.forEach(async (value, index) => {
    const newCategory = await prisma.category.upsert({
      where: { id: index + 1 },
      update: {},
      create: {
        id: index + 1,
        name: value,
      },
    });
    console.log(`Created category named ${newCategory.name}`);
  });

  for (let i = 0; i < 3; i++) {
    // ユーザーの作成
    const newUser = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordDigest: faker.internet.password(),
      },
    });
    console.log(`Created user named ${newUser.name}`);

    for (let i = 0; i < 50; i++) {
      // 出費の作成
      const newExpense = await prisma.expense.create({
        data: {
          storeName: faker.company.name(),
          amount: parseInt(
            faker.finance.amount({ min: 0, max: 30000, dec: 0 })
          ),
          date: faker.date.between({
            from: "2024-08-15T00:00:00.000Z",
            to: "2024-10-31T00:00:00.000Z",
          }),
          userId: newUser.id,
          categoryId: Math.floor(Math.random() * 9) + 1,
        },
      });
    }
    console.log("Created Expenses");

    // 予算の作成
    // 8月分
    for (let i = 1; i < 10; i++) {
      const newBudget = await prisma.budget.create({
        data: {
          amount: parseInt(
            faker.finance.amount({ min: 10000, max: 30000, dec: 0 })
          ),
          year_month: new Date(2024, 7, 15),
          userId: newUser.id,
          categoryId: i,
        },
      });
      console.log(`Created newBudget ${newBudget.year_month}`);
    }

    // 9月分
    for (let i = 1; i < 10; i++) {
      const newBudget = await prisma.budget.create({
        data: {
          amount: parseInt(
            faker.finance.amount({ min: 10000, max: 30000, dec: 0 })
          ),
          year_month: new Date(2024, 8, 15),
          userId: newUser.id,
          categoryId: i,
        },
      });
      console.log(`Created newBudget ${newBudget.year_month}`);
    }

    // 10月分
    for (let i = 1; i < 10; i++) {
      const newBudget = await prisma.budget.create({
        data: {
          amount: parseInt(
            faker.finance.amount({ min: 10000, max: 30000, dec: 0 })
          ),
          year_month: new Date(2024, 9, 15),
          userId: newUser.id,
          categoryId: i,
        },
      });
      console.log(`Created newBudget ${newBudget.year_month}`);
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
