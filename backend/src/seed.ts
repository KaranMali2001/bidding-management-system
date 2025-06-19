import { PrismaClient, ProjectStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create 3 Buyers
  const buyers = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `buyer${i + 1}@example.com`,
          password: `hashed-buyer-password-${i + 1}`,
          role: Role.BUYER,
        },
      }),
    ),
  );

  // 2. Create 2 Sellers
  const sellers = await Promise.all(
    Array.from({ length: 2 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `seller${i + 1}@example.com`,
          password: `hashed-seller-password-${i + 1}`,
          role: Role.SELLER,
        },
      }),
    ),
  );

  // 3. Create 5 Projects (each assigned to random buyer)
  const projects = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.project.create({
        data: {
          title: `Project ${i + 1}`,
          description: `Description for project ${i + 1}`,
          budgetMin: 100 + i * 10,
          budgetMax: 200 + i * 10,
          deadline: new Date(Date.now() + (i + 3) * 24 * 60 * 60 * 1000),
          status: ProjectStatus.Pending,
          buyerId: buyers[i % buyers.length].id,
        },
      }),
    ),
  );

  // 4. Create 5 Bids (1 per project, rotating sellers)
  const bids = await Promise.all(
    projects.map((project, i) =>
      prisma.bid.create({
        data: {
          amount: 150 + i * 10,
          estimatedTime: `${3 + i} days`,
          message: `This is a bid for project ${project.title}`,
          projectId: project.id,
          sellerId: sellers[i % sellers.length].id,
        },
      }),
    ),
  );

  // 5. Update projects with selectedBidId and mark as InProgress
  await Promise.all(
    projects.map((project, i) =>
      prisma.project.update({
        where: { id: project.id },
        data: {
          selectedBidId: bids[i].id,
          status: ProjectStatus.InProgress,
        },
      }),
    ),
  );

  // 6. Create 5 Deliverables
  await Promise.all(
    projects.map((project, i) =>
      prisma.deliverable.create({
        data: {
          fileUrl: `https://example.com/deliverables/${project.id}.zip`,
          projectId: project.id,
        },
      }),
    ),
  );

  // 7. Create 5 Reviews (1 per project)
  await Promise.all(
    projects.map((project, i) =>
      prisma.review.create({
        data: {
          rating: 4 + (i % 2), // 4 or 5
          review: `Review for project ${project.title}`,
          projectId: project.id,
        },
      }),
    ),
  );

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
