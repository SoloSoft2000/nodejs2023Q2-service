import { IsUUID } from 'class-validator';

export class Album {
  @IsUUID('4')
  id: string; // uuid v4

  name: string;
  artistId: string | null; // refers to Artist
  year: number; //

  constructor(partial: Partial<Album>) {
    Object.assign(this, partial);
  }
}
