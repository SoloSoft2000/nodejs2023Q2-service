import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
    const album = this.albumService.findOne(uuid);
    if (album) {
      return album;
    }
    throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
  }

  @Put(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(uuid, updateAlbumDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  async remove(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    try {
      await this.albumService.remove(uuid);
      return { message: 'Album deleted successfully' };
    } catch (error) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
  }
}
