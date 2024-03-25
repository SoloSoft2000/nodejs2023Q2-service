import { Artist } from '@prisma/client';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class ArtistEntity implements Artist {
  constructor(partial: Partial<ArtistEntity>) {
    Object.assign(this, partial);
  }

  @IsUUID('4')
  id: string;

  @IsBoolean()
  grammy: boolean;

  @IsString()
  name: string;
}
