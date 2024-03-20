import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    return await this.prisma.album.create({ data: createAlbumDto });
  }

  async findAll(): Promise<AlbumEntity[]> {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<AlbumEntity> {
    return await this.prisma.album.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return await this.prisma.album.update({
      where: {
        id,
      },
      data: updateAlbumDto,
    });
  }

  async remove(id: string): Promise<AlbumEntity> {
    return await this.prisma.album.delete({
      where: {
        id,
      },
    });
  }
}
