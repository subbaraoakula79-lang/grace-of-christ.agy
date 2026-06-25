const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- GALLERY IMAGES IN DATABASE ---');
  try {
    const images = await prisma.galleryImage.findMany();
    console.log(JSON.stringify(images, null, 2));
  } catch (err) {
    console.error('Error fetching gallery images:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
