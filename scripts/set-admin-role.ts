import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdminRole() {
  // Get email from command line argument or use a default
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx ts-node scripts/set-admin-role.ts <email>');
    console.log('\nExample: npx ts-node scripts/set-admin-role.ts user@example.com');
    process.exit(1);
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.email} (ID: ${user.id})`);
    console.log(`Current role: ${user.role || 'NOT SET'}`);

    // Update user role to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' },
    });

    console.log(`✅ Successfully updated user role to: ${updatedUser.role}`);
    console.log('\nYou can now access admin features!');
  } catch (error) {
    console.error('Error updating user role:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();
