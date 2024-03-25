import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  name: string;

  @IsUUID('4')
  @IsOptional()
  artistId: string | null; // refers to Artist

  @IsUUID('4')
  @IsOptional()
  albumId: string | null; // refers to Album

  @IsNotEmpty()
  @IsNumber()
  duration: number; // integer number
}
