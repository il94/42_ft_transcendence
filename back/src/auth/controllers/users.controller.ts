import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

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
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findById(id));
  }

  @UseGuards(JwtGuard)
	@Get('me')
	getMe() {
		return "user info";
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

  @UseGuards(JwtGuard)
  @Post('friend-request/send/:isFriendId')
  @ApiOkResponse({ type: UserEntity })
  async sendFriendRequest(
    @Param('isFriendId', ParseIntPipe) isFriendId: number,
    @Request() req) {
    return await this.usersService.sendFriendRequest(isFriendId, req.user);
  }
}
