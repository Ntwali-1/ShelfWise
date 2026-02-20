import { PrismaClient } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

async function main() {
    console.log('Starting cleanup process...');

    // 1. Delete all data from local database (in correct order due to foreign keys)
    try {
        console.log('Deleting data from local database...');
        
        // Delete in order: child tables first, then parent tables
        const deleteReviews = await prisma.review.deleteMany();
        console.log(`Deleted ${deleteReviews.count} reviews.`);
        
        const deleteOrderItems = await prisma.orderItem.deleteMany();
        console.log(`Deleted ${deleteOrderItems.count} order items.`);
        
        const deleteOrders = await prisma.order.deleteMany();
        console.log(`Deleted ${deleteOrders.count} orders.`);
        
        const deleteCartItems = await prisma.cartItem.deleteMany();
        console.log(`Deleted ${deleteCartItems.count} cart items.`);
        
        const deleteCarts = await prisma.cart.deleteMany();
        console.log(`Deleted ${deleteCarts.count} carts.`);
        
        const deleteWishlists = await prisma.wishlist.deleteMany();
        console.log(`Deleted ${deleteWishlists.count} wishlist items.`);
        
        const deleteProfiles = await prisma.profile.deleteMany();
        console.log(`Deleted ${deleteProfiles.count} profiles.`);
        
        const deleteUsers = await prisma.user.deleteMany();
        console.log(`Deleted ${deleteUsers.count} users.`);
        
        console.log('Local database cleanup complete.');
    } catch (error) {
        console.error('Error deleting data from local database:', error);
    }

    // 2. Delete all users from Clerk
    try {
        console.log('Fetching users from Clerk...');
        const userList = await clerkClient.users.getUserList({
            limit: 100,
        });

        if (userList.data.length === 0) {
            console.log('No users found in Clerk.');
        } else {
            console.log(`Found ${userList.data.length} users in Clerk. Deleting...`);

            for (const user of userList.data) {
                try {
                    await clerkClient.users.deleteUser(user.id);
                    console.log(`Deleted Clerk user: ${user.id} (${user.emailAddresses[0]?.emailAddress})`);
                } catch (err) {
                    console.error(`Failed to delete Clerk user ${user.id}:`, err);
                }
            }
            console.log('Clerk user cleanup complete.');
        }
    } catch (error) {
        console.error('Error cleaning up Clerk users:', error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
