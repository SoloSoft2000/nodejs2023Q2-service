import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  // private favorites: Set<string> = new Set();

  constructor(private prisma: PrismaService) {}
  // private readonly albumService: AlbumService,
  // private readonly trackService: TrackService,

  addToFavorites(id: string) {
    console.log(`add to fav artist ${id}`);
    // this.favorites.add(id);
  }

  removeFromFavorites(id: string) {
    console.log(`remove from fav artist ${id}`);
    // this.favorites.delete(id);
  }

  getFavorites() {
    return []; //this.artists.filter((artist) => this.favorites.has(artist.id));
  }

  hasFavorite(id: string) {
    console.log(`check in fav artist ${id}`);
    return false;
    // return this.favorites.has(id);
  }

  async create(createArtistDto: CreateArtistDto) {
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistForUpdate = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artistForUpdate) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.artist.update({
      where: {
        id,
      },
      data: updateArtistDto,
    });
  }

  async remove(id: string) {
    const result = await this.prisma.artist.delete({
      where: {
        id,
      },
    });
    
    if (result) {
      // this.albumService.removeArtist(id);
      // this.trackService.removeArtist(id);
      this.removeFromFavorites(id);
    }
    return result;
  }
}
