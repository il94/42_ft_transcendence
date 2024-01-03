import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { CreateChannelDto, UpdateChannelDto } from './dto';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { getUser } from '../auth/decorators/users.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';


@UseGuards(JwtGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @Request() req) {
  console.log("guard passed in channel : ", req.user)
	return this.channelsService.createChannel(createChannelDto, req.user);
  }

  @Get()
  findAll() {
    return this.channelsService.findAllChannels();
  }

  @Get(':id')
  findUserOne(@Param('id', ParseIntPipe) id: number) {
    return this.channelsService.findChannel(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() member: User) {
    return this.channelsService.findOneChannel(id, member);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, 
  @Body() updateChannelDto: UpdateChannelDto, 
  @Request() member: User) {
    return this.channelsService.updateChannel(updateChannelDto, member);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.channelsService.remove(id);
	}
}