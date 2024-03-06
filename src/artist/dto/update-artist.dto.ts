import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
