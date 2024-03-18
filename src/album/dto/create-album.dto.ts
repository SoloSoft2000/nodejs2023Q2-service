import { IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  name: string;

  @IsUUID('4')
  @IsOptional()
  artistId: string | null; // refers to Artist

  @IsNotEmpty()
  @IsInt()
  year: number; // integer number
}
