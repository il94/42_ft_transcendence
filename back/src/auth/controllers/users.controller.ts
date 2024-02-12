import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipeBuilder, ParseFilePipe,
  HttpStatus, StreamableFile } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtGuard } from '../guards/auth.guard';
import { UpdateUserDto } from '../dto/users.dto';
import { getUser } from '../decorators/users.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from '../file.validdator';
import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// @UseGuards(JwtGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

	// Upload un avatar
	@Post('upload')
	postAvatar(@Body() link: string) {
		console.log("CONTROLEUR", link)
		return this.usersService.uploadAvatar(link)
	}

	// Renvoie les donnees publiaues de tout les users
	@Get()
	@UseGuards(JwtGuard)
	findAll() {
		return this.usersService.findAll()
	}

	// Renvoie le user authentifie
	@Get('me')
	@UseGuards(JwtGuard)
	async getMe(@getUser() user: User) {
		return user
	}

	// Renvoie les channels du user auth sauf ceux dans lesquels il est ban
	@Get('channels')
	@UseGuards(JwtGuard)
	async getUserChannels(@getUser('id') userId: number) {
		return this.usersService.findUserChannel(userId)
	}

	// Renvoie les donnees publiques d'un user
	@Get(':id')
	@UseGuards(JwtGuard)
	async findById(@Param('id', ParseIntPipe) userId: number): Promise<Partial<User>> {
		return this.usersService.findById(userId)
	}

  // historique de matches du user (retourne null si aucun matchs joues)
  @Get('matchs/:id')
	@UseGuards(JwtGuard)
	async getUserMatchs(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMatchHistory(id);
  }

  	// Modifie le user authentifie
	@Patch('me')
	@UseGuards(JwtGuard)
	@UseInterceptors(FileInterceptor('file'))
	async update(@getUser('id') userId: number, 
	@Body('newDatas') updateUserDto: UpdateUserDto,
	@UploadedFile(
		new ParseFilePipeBuilder().addValidator(
			new CustomUploadFileTypeValidator({
				fileType: VALID_UPLOADS_MIME_TYPES,
			}),
		)
		.addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
		.build({
			fileIsRequired: false,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		})
	) file?: Express.Multer.File) {

		return await this.usersService.updateUser(userId, JSON.parse(updateUserDto.toString()), file)
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
