import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        clerkId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      console.log('No users found in database');
      return;
    }

    console.log('\n📋 Users in Database:\n');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role || '❌ NOT SET'}`);
      console.log(`   Clerk ID: ${user.clerkId || 'N/A'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log('─'.repeat(80));
    });

    console.log(`\nTotal users: ${users.length}\n`);
    
    // Show users without roles
    const usersWithoutRole = users.filter(u => !u.role);
    if (usersWithoutRole.length > 0) {
      console.log('⚠️  Users without role:');
      usersWithoutRole.forEach(u => {
        console.log(`   - ${u.email} (ID: ${u.id})`);
      });
      console.log('\nTo set admin role, run:');
      console.log('npx ts-node scripts/set-admin-role.ts <email>\n');
    }
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
