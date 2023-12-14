import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto, UpdateFriendDto } from './dto/friends.dto';
import { FriendsEntity } from './entities/friend.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
//import { AuthGuard } from '../auth/guards/auth.guard';
//import { JwtPayload } from 'src/users/constants';
import { getUser } from '../auth/decorators/users.decorator';
import { User } from '@prisma/client';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('friend-request/send/:isFriendId')
  @ApiOkResponse({ type: UserEntity })
  async sendFriendRequest(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.friendsService.sendFriendRequest(isFriendId, user);
  }

  @Get('friend-request/status/:isFriendId')
  @ApiOkResponse({ type: UserEntity })
  async getFriendRequestStatus(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.friendsService.getFriendRequestStatus(isFriendId, user);
  }

  @Post("friends/add/")
    addNewFriend(@getUser() user: User, @Body() payload: { userId: number }) {
        return this.friendsService.addFriend(user.id, payload.userId);
    }

  @Get('friends/:id')
  @ApiOkResponse({ type: FriendsEntity })
  async getUserFriends(
    @Param('id', ParseIntPipe) id: number) {
    return await this.friendsService.getUserFriends(id);
  }

  //
  // @Patch

  @Delete("friends-remove/:id")
  @ApiOkResponse({ type: FriendsEntity })
  async removeFriend(
    @Param('id', ParseIntPipe) id: number, 
    @Body('friendId', ParseIntPipe) friendId: number) {
        return this.friendsService.removeFriend(id, friendId);
    }

  @Post()
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendsService.create(createFriendDto);
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
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendsService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendsService.remove(+id);
  }
}
