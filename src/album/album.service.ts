import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = new Album({
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    });
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const idx = this.albums.findIndex((album) => album.id === id);
    if (idx === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    const album = this.albums[idx];
    album.name = updateAlbumDto.name || album.name;
    album.year = updateAlbumDto.year || album.year;
    album.artistId = updateAlbumDto.artistId || album.artistId;

    this.albums[idx] = album;

    return this.albums[idx];
  }

  remove(id: string) {
    const initialLength = this.albums.length;
    this.albums = this.albums.filter((album) => album.id !== id);
    return initialLength !== this.albums.length;
  }
}
