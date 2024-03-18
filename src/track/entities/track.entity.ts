import { Track } from '@prisma/client';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class TrackEntity implements Track {
  constructor(partial: Partial<TrackEntity>) {
    Object.assign(this, partial);
  }

  @IsUUID('4')
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  @IsUUID('4')
  albumId: string;

  @IsUUID('4')
  artistId: string;
}
