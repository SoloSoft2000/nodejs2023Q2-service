import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];
  private favorites: Set<string> = new Set();

  addToFavorites(id: string) {
    this.favorites.add(id);
  }

  removeFromFavorites(id: string) {
    this.favorites.delete(id);
  }

  hasFavorite(id: string) {
    return this.favorites.has(id);
  }

  getFavorites() {
    return this.tracks.filter((track) => this.favorites.has(track.id));
  }

  create(createTrackDto: CreateTrackDto) {
    const newTrack = new Track({
      id: randomUUID(),
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      albumId: createTrackDto.albumId || null,
      artistId: createTrackDto.artistId || null,
    });
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const idx = this.tracks.findIndex((track) => track.id === id);
    if (idx === -1) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    const track = this.tracks[idx];
    track.name = updateTrackDto.name || track.name;
    track.duration = updateTrackDto.duration || track.duration;
    track.albumId = updateTrackDto.albumId || track.albumId;
    track.artistId = updateTrackDto.artistId || track.artistId;

    this.tracks[idx] = track;

    return this.tracks[idx];
  }

  remove(id: string) {
    const initialLength = this.tracks.length;
    this.tracks = this.tracks.filter((track) => track.id !== id);
    const result = initialLength !== this.tracks.length;
    if (result) {
      this.removeFromFavorites(id);
    }
    return result;
  }

  removeArtist(id: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
      return track;
    });
  }

  removeAlbum(id: string) {
    this.tracks = this.tracks.map((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
      return track;
    });
  }
}
