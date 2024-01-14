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
import { CreateUserDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post(':id')
  addNewFriend(@getUser() user: User,
  @Param('id', ParseIntPipe) id: number) {
      console.log("taget id: ", id);
      return this.friendsService.addFriend(user.id, id);
  }
  
  @Post('request/:isFriendId')
  sendFriendRequest(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return this.friendsService.sendFriendRequest(isFriendId, user);
  }

  @Get()
  async getUserFriends(@getUser() user: User ) {
    return await this.friendsService.getUserFriends(user.id);
  }

  @Get('request/status/:isFriendId')
  async getFriendRequestStatus(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.friendsService.getFriendRequestStatus(isFriendId, user);
  }

  @Patch('update/:id')
  updateRelation(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: RelationDto) {
        return this.friendsService.updateRelation(id, dto);
    }

  @Delete(':id')
  async removeFriend(@getUser() user: User,
  @Param('id', ParseIntPipe) friendId: number) {
        return this.friendsService.removeFriend(user.id, friendId);
    }

}
