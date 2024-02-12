import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { getUser } from '../decorators/users.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

	// Renvoie les donnees publiaues de tout les users
	@Get()
	findAll() {
		return this.usersService.findAll()
	}

	// Renvoie le user authentifie
	@Get('me')
	async getMe(@getUser() user: User) {
		return user
	}

	// Renvoie les channels du user auth sauf ceux dans lesquels il est ban
	@Get('channels')
	async getUserChannels(@getUser('id') userId: number) {
		return this.usersService.findUserChannel(userId)
	}

	// Renvoie les donnees publiques d'un user
	@Get(':id')
	async findById(@Param('id', ParseIntPipe) userId: number): Promise<Partial<User>> {
		return this.usersService.findById(userId)
	}

  // historique de matches du user (retourne null si aucun matchs joues)
  @Get('matchs/:id')
  async getUserMatchs(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMatchHistory(id);
  }

  	// Modifie le user authentifie
	// @Patch('me')
	// async update(@getUser('id') userId: number, 
	// @Body() updateUserDto: UpdateUserDto) {
	// 	return this.usersService.updateUser(userId, updateUserDto)
	// }
}

/* =========================== PAS UTILISEES ================================ */

// @Get(':id')
// async findById(@Param('id', ParseIntPipe) id: number) {
//   return this.usersService.findById(id);
// }

// @Delete()
// async remove(@getUser('id') userId: number) {
//   return this.usersService.remove(userId);
// }
