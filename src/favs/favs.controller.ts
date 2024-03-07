import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post(':fav/:uuid')
  addTrack(
    @Param('fav') fav: string,
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    const isAdded = this.favsService.add(fav, uuid);
    if (isAdded) {
      return { message: `${fav} added to favorites` };
    }
    throw new HttpException(
      `${fav} not found`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  @Delete(':fav/:uuid')
  @HttpCode(204)
  remove(
    @Param('fav') fav: string,
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    const isDeleted = this.favsService.remove(fav, uuid);
    if (isDeleted) {
      return { message: `${fav} deleted successfully` };
    }
    throw new HttpException(`${fav} not found`, HttpStatus.NOT_FOUND);
  }
}
