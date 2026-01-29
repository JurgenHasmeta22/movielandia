import 'dotenv/config';
import { prisma } from '../config/prisma';

async function main() {
  try {
    const res = await prisma.$queryRawUnsafe(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' ORDER BY tablename;"
    );
    
    console.log('Public tables:', res);
  } catch (err) {
    console.error('Error querying tables:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
