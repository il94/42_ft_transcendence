import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { getUser } from '../decorators/users.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

	// Renvoie tout les users
	@Get()
	@ApiOkResponse({ type: UserEntity, isArray: true })
	findAll() {
		return this.usersService.findAll()
	}
  
  @Get('me')
  async getMe(@getUser() user: User) {
    return user;
  }

  // RQPR touts les channels d'un user 
  @Get('channels')
  async getUserChannels(@getUser() user: User) {
    return this.usersService.findUserChannel(user);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  	// Modifie le user authentifie
	@Patch('me')
	async update(@getUser('id') userId: number, 
	@Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(userId, updateUserDto)
	}

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

}

