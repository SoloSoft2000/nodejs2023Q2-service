import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    const newArtist = new Artist({
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const idx = this.artists.findIndex((artist) => artist.id === id);
    if (idx === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const artist = this.artists[idx];

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    this.artists[idx] = artist;

    return this.artists[idx];
  }

  remove(id: string) {
    const initialLength = this.artists.length;
    this.artists = this.artists.filter((artist) => artist.id !== id);
    return initialLength !== this.artists.length;
  }
}
