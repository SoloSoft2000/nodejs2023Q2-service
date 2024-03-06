import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  name: string;

  artistId: string | null; // refers to Artist

  @IsNotEmpty()
  @IsInt()
  year: number; // integer number
}
