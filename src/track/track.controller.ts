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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
    const track = this.trackService.findOne(uuid);
    if (track) {
      return track;
    }
    throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
  }

  @Put(':uuid')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(uuid, updateTrackDto);
  }

  @Delete(':uuid')
  @HttpCode(204)
  remove(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
    const isDeleted = this.trackService.remove(uuid);
    if (isDeleted) {
      return { message: 'Track deleted successfully' };
    }
    throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
  }
}
