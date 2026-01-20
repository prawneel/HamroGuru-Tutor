const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const users = [
    { id: 'teacher1', email: 'alice@example.com', name: 'Alice Teacher', role: 'teacher' },
    { id: 'student1', email: 'bob@example.com', name: 'Bob Student', role: 'student' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { ...u, updatedAt: new Date() },
      create: { ...u, createdAt: new Date(), updatedAt: new Date() },
    });
  }

  await prisma.teacherProfile.upsert({
    where: { id: 'teacher1' },
    update: { updatedAt: new Date() },
    create: {
      id: 'teacher1',
      userId: 'teacher1',
      phone: '1234567890',
      age: 30,
      gender: 'female',
      city: 'Kathmandu',
      highestQualification: 'MSc',
      subjects: 'Math,Physics',
      teachingMode: 'online',
      experience: '5 years',
      rateType: 'hourly',
      rateAmount: 20.0,
      availability: 'Weekdays',
      whatsappNumber: '1234567890',
      whatsappConsent: true,
      additionalInfo: 'Experienced tutor',
      rating: 5.0,
      reviews: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Seeding complete');
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
