import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
    const artist = this.artistService.findOne(uuid);
    if (artist) {
      return artist;
    }
    throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
  }

  @Put(':uuid')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(uuid, updateArtistDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  remove(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
    const isDeleted = this.artistService.remove(uuid);
    if (isDeleted) {
      return { message: 'User deleted successfully' };
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
