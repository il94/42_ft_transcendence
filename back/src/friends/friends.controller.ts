import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { RelationDto } from './dto/friends.dto';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
//import { AuthGuard } from '../auth/guards/auth.guard';
//import { JwtPayload } from 'src/users/constants';
import { getUser } from '../auth/decorators/users.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add')
  async addNewFriend(@getUser() user: User, @Body() payload: { userId: number }) {
        return this.friendsService.addFriend(user.id, payload.userId);
  }

  @Post('request/:isFriendId')
  async sendFriendRequest(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.friendsService.sendFriendRequest(isFriendId, user);
  }

  @Get(':id')
  async getUserFriends(
    @Param('id', ParseIntPipe) id: number) {
    return await this.friendsService.getUserFriends(id);
  }

  @Get('request/status/:isFriendId')
  async getFriendRequestStatus(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.friendsService.getFriendRequestStatus(isFriendId, user);
  }

  @Patch('update/:id')
  async updateRelation(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: RelationDto) {
        return this.friendsService.updateRelation(id, dto);
    }

  @Delete('remove/:id')
  async removeFriend(
    @Param('id', ParseIntPipe) id: number, 
    @Body('friendId', ParseIntPipe) friendId: number) {
        return this.friendsService.removeFriend(id, friendId);
    }

  @Post()
  create(@Body() createRelationDto: RelationDto) {
    return this.friendsService.create(createRelationDto);
  }

  @Get()
  findAll() {
    return this.friendsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() relationDto: RelationDto) {
    return this.friendsService.update(+id, relationDto);
  }

}
