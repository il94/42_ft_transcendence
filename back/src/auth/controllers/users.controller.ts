import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipeBuilder, ParseFilePipe,
  HttpStatus, } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { UpdateUserDto } from '../dto/users.dto';
import { getUser } from '../decorators/users.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from '../file.validdator';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];

@UseGuards(JwtGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@getUser() user: User, @UploadedFile(
		new ParseFilePipeBuilder()
			.addValidator(
			new CustomUploadFileTypeValidator({
				fileType: VALID_UPLOADS_MIME_TYPES,
			}),
			)
			.addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
			.build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
	) file: Express.Multer.File) {
		console.log(file.buffer.toString('base64'));
		// return await this.usersService.uploadAvatar(user.id, file.buffer.toString())
		// {
		// 	file: file.buffer.toString(),
		// 	};
	}

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
	@Patch('me')
	async update(@getUser('id') userId: number, 
	@Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(userId, updateUserDto)
	}

  	// Modifie le user authentifie
	@Patch('avatar')
	@UseInterceptors(FileInterceptor('image'))
	async updateAvatar(@getUser('id') userId: number, 
	@Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateUser(userId, avatar)
	}
  

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
