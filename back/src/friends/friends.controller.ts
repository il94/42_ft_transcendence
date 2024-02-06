import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { getUser } from '../auth/decorators/users.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
	constructor(private readonly friendsService: FriendsService) {}

	// Ajoute un user en ami
	@Post(':id')
	addNewFriend(@getUser('id') userAuthId: number,
	@Param('id', ParseIntPipe) userTargetId: number) {
		return this.friendsService.addFriend(userAuthId, userTargetId)
	}

	// Retourne les amis du user
	@Get()
	async getUserFriends(@getUser() user: User) {
		return await this.friendsService.getUserFriends(user.id)
	}

	// Supprime un ami
	@Delete(':id')
	removeFriend(@getUser('id') userAuthId: number,
	@Param('id', ParseIntPipe) userTargetId: number) {
		return this.friendsService.removeFriend(userAuthId, userTargetId)
    }

/* =========================== PAS UTILISEES ================================ */

  // @Post('request/:isFriendId')
  // sendFriendRequest(
  //   @Param('isFriendId', ParseIntPipe) isFriendId: number,
  //   @Request() user: User) {
  //   return this.friendsService.sendFriendRequest(isFriendId, user);
  // }

  // @Get('request/status/:isFriendId')
  // async getFriendRequestStatus(
  //   @Param('isFriendId', ParseIntPipe) isFriendId: number,
  //   @Request() user: User) {
  //   return await this.friendsService.getFriendRequestStatus(isFriendId, user);
  // }

  // @Patch('update/:id')
  // updateRelation(
  //   @Param('id', ParseIntPipe) id: number, 
  //   @Body() dto: RelationDto) {
  //       return this.friendsService.updateRelation(id, dto);
  //   }


}
