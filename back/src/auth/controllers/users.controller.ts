import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity, FriendsEntity } from '../entities/';
import { getUser } from '../decorators/users.decorator'
import { User } from '@prisma/client';

// @UseGuards(JwtGuard)
@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }
  
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@getUser() user: User) {
    console.log(user);
    return user;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findById(id));
  }


  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return new UserEntity(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }

  /******** FRIENDS CRUD *********/

  @Post('friend-request/send/:isFriendId')
  @ApiOkResponse({ type: UserEntity })
  async sendFriendRequest(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.usersService.sendFriendRequest(isFriendId, user);
  }

  @Get('friend-request/status/:isFriendId')
  @ApiOkResponse({ type: UserEntity })
  async getFriendRequestStatus(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() user: User) {
    return await this.usersService.getFriendRequestStatus(isFriendId, user);
  }

  @Post("friends/add/")
    addNewFriend(@getUser() user: User, @Body() payload: { userId: number }) {
        return this.usersService.addFriend(user.id, payload.userId);
    }

  @Get('friends/:id')
  @ApiOkResponse({ type: FriendsEntity })
  async getUserFriends(
    @Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUserFriends(id);
  }

  //
  // @Patch

  @Delete("friends-remove/:id")
  @ApiOkResponse({ type: FriendsEntity })
  async removeFriend(
    @Param('id', ParseIntPipe) id: number, 
    @Body('friendId', ParseIntPipe) friendId: number) {
        return this.usersService.removeFriend(id, friendId);
    }
}

