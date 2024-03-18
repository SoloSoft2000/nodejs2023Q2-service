import { Album } from '@prisma/client';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class AlbumEntity implements Album {
  constructor(partial: Partial<AlbumEntity>) {
    Object.assign(this, partial);
  }

  @IsUUID('4')
  id: string;

  @IsInt()
  year: number;

  @IsString()
  name: string;

  @IsUUID('4')
  artistId: string;
}
