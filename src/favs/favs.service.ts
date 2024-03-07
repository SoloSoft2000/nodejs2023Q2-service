import { Injectable } from '@nestjs/common';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavsService {
  private favArtists: string[] = [];
  private favAlbums: string[] = [];
  private favTracks: string[] = [];

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  findAll() {
    const artists = this.favArtists.map((id) => this.artistService.findOne(id));
    const albums = this.favAlbums.map((id) => this.albumService.findOne(id));
    const tracks = this.favTracks.map((id) => this.trackService.findOne(id));
    return { artists, albums, tracks };
  }

  add(favTable: string, id: string) {
    switch (favTable) {
      case 'track':
        if (this.trackService.findOne(id)) {
          this.favTracks.push(id);
          return true;
        }
        return false;
      case 'artist':
        if (this.artistService.findOne(id)) {
          this.favArtists.push(id);
          return true;
        }
        return false;
      case 'album':
        if (this.albumService.findOne(id)) {
          this.favAlbums.push(id);
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
        const tracksLength = this.favTracks.length;
        this.favTracks = this.favTracks.filter((item) => item !== id);
        return tracksLength !== this.favTracks.length;
      case 'artist':
        const artistsLength = this.favArtists.length;
        this.favArtists = this.favArtists.filter((item) => item !== id);
        return artistsLength !== this.favArtists.length;
      case 'album':
        const albumsLength = this.favAlbums.length;
        this.favAlbums = this.favAlbums.filter((item) => item !== id);
        return albumsLength !== this.favAlbums.length;
      default:
        return false;
    }
  }
}
