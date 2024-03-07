import { Injectable } from '@nestjs/common';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  findAll() {
    const artists = this.artistService.getFavorites();
    const albums = this.albumService.getFavorites();
    const tracks = this.trackService.getFavorites();
    return { artists, albums, tracks };
  }

  add(favTable: string, id: string) {
    switch (favTable) {
      case 'track':
        if (this.trackService.findOne(id)) {
          this.trackService.addToFavorites(id);
          return true;
        }
        return false;
      case 'artist':
        if (this.artistService.findOne(id)) {
          this.artistService.addToFavorites(id);
          return true;
        }
        return false;
      case 'album':
        if (this.albumService.findOne(id)) {
          this.albumService.addToFavorites(id);
          return true;
        }
        return false;
      default:
        return false;
    }
  }

  remove(favTable: string, id: string) {
    switch (favTable) {
      case 'track':
        if (this.trackService.hasFavorite(id)) {
          this.trackService.removeFromFavorites(id);
          return true;
        }
        return false;
      case 'artist':
        if (this.artistService.hasFavorite(id)) {
          this.artistService.removeFromFavorites(id);
          return true;
        }
        return false;
      case 'album':
        if (this.albumService.hasFavorite(id)) {
          this.albumService.removeFromFavorites(id);
          return true;
        }
        return false;
      default:
        return false;
    }
  }
}
