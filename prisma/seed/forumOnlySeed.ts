import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateForumData } from "./forumSeed";

const adapter = new PrismaPg({
	connectionString: process.env.POSTGRES_PRISMA_URL,
});

export const prisma = new PrismaClient({
	adapter,
});

async function deleteForumData() {
	console.log("Deleting existing forum data...");

	await prisma.upvoteForumReply.deleteMany();
	await prisma.forumReplyHistory.deleteMany();
	await prisma.forumReply.deleteMany();

	await prisma.upvoteForumPost.deleteMany();
	await prisma.forumPost.deleteMany();

	await prisma.upvoteForumTopic.deleteMany();
	await prisma.userForumTopicFavorite.deleteMany();
	await prisma.userForumTopicWatch.deleteMany();
	await prisma.forumTopic.deleteMany();

	await prisma.userForumModerator.deleteMany();
	await prisma.forumUserStats.deleteMany();
	await prisma.forumTag.deleteMany();
	await prisma.forumCategory.deleteMany();

	console.log("Forum data deleted successfully.");
}

async function main() {
	try {
		await deleteForumData();
		await generateForumData();

		console.log("Forum seeding completed successfully.");

		await prisma.$disconnect();
	} catch (error) {
		console.error("Error during forum seeding:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
