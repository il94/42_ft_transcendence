import { Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipeBuilder, ParseFilePipe,
  HttpStatus, StreamableFile } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Api42AuthGuard, JwtGuard } from '../guards/auth.guard';

import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { getUser, Public } from '../decorators/users.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from '../file.validdator';
import * as fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

import { VALID_UPLOADS_MIME_TYPES, MAX_PROFILE_PICTURE_SIZE_IN_BYTES } from 'src/app.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

	// Upload un avatar
	@Public()
	@UseGuards(Api42AuthGuard)
	@Post('upload')
	postAvatar(@Body() link: string) {
		console.log("CONTROLEUR", link)
		return this.usersService.uploadAvatar(link)
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
	@UseInterceptors(FileInterceptor('file'))
	async update(@getUser('id') userId: number, 
	@Body('newDatas') updateUserDto: string,
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

		const newDatas: UpdateUserDto = JSON.parse(updateUserDto)
		await this.usersService.parseMultiPartUpdate(newDatas)

		return await this.usersService.updateUser(userId, newDatas, file)
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
