import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";
import { forumCategories } from "./data/forumData";
import { forumTags } from "./data/forumTagData";

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

async function seedForumCategoriesAndTags() {
	console.log("Starting forum categories, tags, and topics seeding...");

	const users = await prisma.user.findMany({ select: { id: true } });
	
	if (users.length === 0) {
		throw new Error("No users found in database. Please seed users first.");
	}

	console.log("Creating forum categories...");
	for (const category of forumCategories) {
		await prisma.forumCategory.create({
			data: {
				name: category.name,
				description: category.description,
				order: category.order,
				slug: category.slug,
				isActive: category.isActive,
				topicCount: 0,
				postCount: 0,
			},
		});
	}
	console.log(`Created ${forumCategories.length} forum categories.`);

	console.log("Creating forum tags...");
	for (const tag of forumTags) {
		await prisma.forumTag.create({
			data: tag,
		});
	}
	console.log(`Created ${forumTags.length} forum tags.`);

	const categories = await prisma.forumCategory.findMany();
	const tags = await prisma.forumTag.findMany();
	
	console.log("Creating forum topics...");
	let totalTopicsCreated = 0;

	for (const category of categories) {
		const topicCount = Math.floor(Math.random() * 8) + 3;

		for (let i = 0; i < topicCount; i++) {
			const userId = faker.helpers.arrayElement(users).id;
			const isPinned = Math.random() < 0.2;
			const isLocked = Math.random() < 0.1;

			const title = faker.lorem.sentence().replace(/\.$/, "");
			const content = `<p>${faker.lorem.paragraphs(3).replace(/\n/g, "</p><p>")}</p>`;

			const slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "");

			const tagCount = Math.floor(Math.random() * 3) + 1;
			const selectedTags = faker.helpers.arrayElements(tags, tagCount);

			await prisma.forumTopic.create({
				data: {
					title,
					content,
					slug: `${slug}-${Date.now()}-${i}`,
					isPinned,
					isLocked,
					viewCount: Math.floor(Math.random() * 100),
					categoryId: category.id,
					userId,
					tags: {
						connect: selectedTags.map((tag) => ({ id: tag.id })),
					},
				},
			});

			totalTopicsCreated++;
		}

		await prisma.forumCategory.update({
			where: { id: category.id },
			data: {
				topicCount,
			},
		});
	}

	console.log(`Created ${totalTopicsCreated} forum topics.`);
	console.log("Forum categories, tags, and topics seeding completed successfully.");
}

async function main() {
	try {
		await deleteForumData();
		await seedForumCategoriesAndTags();
		await prisma.$disconnect();
	} catch (error) {
		console.error("Error during forum seeding:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
