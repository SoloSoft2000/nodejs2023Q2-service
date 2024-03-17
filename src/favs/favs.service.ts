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
      },
    });
    return {
      artists: artists.map((item) => item.artist),
      albums: albums.map((item) => item.album),
      tracks: tracks.map((item) => item.track),
    };
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
