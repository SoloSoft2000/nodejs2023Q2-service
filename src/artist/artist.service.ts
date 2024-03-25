import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll(): Promise<ArtistEntity[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<ArtistEntity> {
    return await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
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

  async remove(id: string): Promise<ArtistEntity> {
    return await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }
}
