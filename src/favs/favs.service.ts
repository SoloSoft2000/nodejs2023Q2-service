import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const artists = await this.prisma.favorites.findMany({
      where: {
        artistId: {
          not: null,
        },
      },
      select: {
        artist: true,
        album: false,
        track: false,
      },
    });
    const albums = await this.prisma.favorites.findMany({
      where: {
        albumId: {
          not: null,
        },
      },
      select: {
        album: true,
        artist: false,
        track: false,
      },
    });
    const tracks = await this.prisma.favorites.findMany({
      where: {
        trackId: {
          not: null,
        },
      },
      select: {
        track: true,
        artist: false,
        album: false,
      },
    });
    return { artists, albums, tracks };
  }

  async add(favTable: string, id: string) {
    switch (favTable) {
      case 'track':
        return await this.prisma.favorites.create({
          data: {
            trackId: id,
          },
        });
      case 'artist':
        return await this.prisma.favorites.create({
          data: {
            artistId: id,
          },
        });
      case 'album':
        return await this.prisma.favorites.create({
          data: {
            albumId: id,
          },
        });
      default:
        return false;
    }
  }

  async remove(favTable: string, id: string) {
    switch (favTable) {
      case 'track':
        return await this.prisma.favorites.deleteMany({
          where: {
            trackId: id,
          },
        });
      case 'artist':
        return await this.prisma.favorites.deleteMany({
          where: {
            artistId: id,
          },
        });
      case 'album':
        return await this.prisma.favorites.deleteMany({
          where: {
            albumId: id,
          },
        });
      default:
        return false;
    }
  }
}
