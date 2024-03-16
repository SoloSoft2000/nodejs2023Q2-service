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
  async findAll() {
    return await this.favsService.findAll();
  }

  @Post(':fav/:uuid')
  async addTrack(
    @Param('fav') fav: string,
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    try {
      await this.favsService.add(fav, uuid);
      return { message: `${fav} added to favorites` };
    } catch {
      throw new HttpException(
        `${fav} not found`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Delete(':fav/:uuid')
  @HttpCode(204)
  async remove(
    @Param('fav') fav: string,
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ) {
    try {
      await this.favsService.remove(fav, uuid);
      return { message: `${fav} deleted successfully` };
    } catch {
      throw new HttpException(`${fav} not found`, HttpStatus.NOT_FOUND);
    }
  }
}
