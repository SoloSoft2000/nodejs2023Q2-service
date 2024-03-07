import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  name: string;

  artistId: string | null; // refers to Artist

  albumId: string | null; // refers to Album

  @IsNotEmpty()
  @IsInt()
  duration: number; // integer number
}
