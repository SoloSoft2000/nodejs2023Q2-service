import { IsUUID } from 'class-validator';

export class Track {
  @IsUUID('4')
  id: string; // uuid v4

  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number

  constructor(partial: Partial<Track>) {
    Object.assign(this, partial);
  }
}
