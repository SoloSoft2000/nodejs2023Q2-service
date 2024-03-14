import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      login: 'User1',
      password: '12345',
    },
  });
  await prisma.user.create({
    data: {
      login: 'User2',
      password: '54321',
    },
  });
  const artist = await prisma.artist.create({
    data: {
      name: 'Artist1',
      grammy: false,
    },
  });
  const album = await prisma.album.create({
    data: {
      name: 'Album1',
      artistId: artist.id,
      year: 2023,
    },
  });
  const track = await prisma.track.create({
    data: {
      name: 'Track1',
      duration: 4.32,
      artistId: artist.id,
      albumId: album.id,
    },
  });
  await prisma.favorites.create({
    data: {
      artistId: artist.id,
    },
  });
  await prisma.favorites.create({
    data: {
      albumId: album.id,
    },
  });
  await prisma.favorites.create({
    data: {
      trackId: track.id,
    },
  });
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
