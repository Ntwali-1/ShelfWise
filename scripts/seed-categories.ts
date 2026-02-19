import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Beauty',
    'Automotive',
  ];

  console.log('Seeding categories...');

  for (const categoryName of categories) {
    try {
      const existing = await prisma.category.findUnique({
        where: { name: categoryName },
      });

      if (!existing) {
        await prisma.category.create({
          data: { name: categoryName },
        });
        console.log(`✓ Created category: ${categoryName}`);
      } else {
        console.log(`- Category already exists: ${categoryName}`);
      }
    } catch (error) {
      console.error(`✗ Failed to create category ${categoryName}:`, error);
    }
  }

  console.log('Seeding completed!');
}

seedCategories()
  .catch((e) => {
    console.error('Error seeding categories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
