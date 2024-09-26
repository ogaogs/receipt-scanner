import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const Categories = ["食費", "水道光熱費", "家賃", "娯楽", "衣服・美容", "日用品", "病院代", "交通費", "その他"]

async function main() {
  console.log("Start Seeding...")

  // カテゴリーの作成
  Categories.forEach(async (value, index) => {
    const newCategory = await prisma.category.create({
      data: {
          id: index+1,
          name: value
      },
  });
  console.log(`Created category named ${newCategory.name}`);
  
  });


}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })