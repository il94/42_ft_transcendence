import { Controller, HttpStatus, UploadedFile, UseInterceptors, ParseFilePipeBuilder, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { CreateChannelDto, UpdateChannelDto, AuthChannelDto, UpdateRoleDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { getUser } from '../auth/decorators/users.decorator';
import { User, challengeStatus, messageStatus } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CustomUploadFileTypeValidator } from 'src/auth/file.validdator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from 'src/auth/dto';

import { IsString, IsNotEmpty, 
	IsOptional, MaxLength, MinLength, IsBoolean, IsAlphanumeric, IsLowercase, IsAlpha
} from "class-validator";

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@UseGuards(JwtGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelsService: ChannelsService) {}

	// Cree un channel
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async create(@getUser('id') userId: number,
	@Body('newDatas') createChannelDto: string,
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
		const newDatas: CreateChannelDto = JSON.parse(createChannelDto)
		await this.channelsService.parseMultiPartCreate(newDatas)
	
		return this.channelsService.createChannel(newDatas, userId, file)
	}

	// Cree un channel MP et y ajoute un user
	@Post('mp/:id')
	createMP(@getUser('id') userAuthId: number,
	@Param('id', ParseIntPipe) userTargetId: number) {
		return this.channelsService.createChannelMP(userAuthId, userTargetId)
	}

	// Ajoute un user dans un channel
	@Post(':id/join')
	join(@getUser('id') userId: number,
	@Param('id', ParseIntPipe) channelId: number,
	@Body() { hash }: AuthChannelDto) {
		return this.channelsService.joinChannel(channelId, userId, hash)
	}

	// Ajoute un user dans un channel
	@Post(':channelId/add/:userTargetId')
	addUser(@getUser() { id: inviterId, username: inviterName }: Partial<User>,
	@Param('channelId', ParseIntPipe) channelId: number,
	@Param('userTargetId', ParseIntPipe) userTargetId: number) {
		return this.channelsService.joinChannel(channelId, userTargetId, undefined, inviterId, inviterName)
	}

	// Cree un message dans un channel
    @Post(':id/message')
    async addMessage(@getUser('id') userId: number,
	@Param('id', ParseIntPipe) channelId: number,
	@Body('msg') msgContent: string, 
	@Body('msgStatus') msgStatus: messageStatus) {
		return await this.channelsService.addContent(channelId, userId, msgContent, msgStatus)
    } 

	// Cree une invitation a jouer dans un channel
	@Post(':id/invitation')
	async addInvitation(@getUser('id') userAuthId: number,
	@Param('id', ParseIntPipe) channelId: number,
	@Body('msgStatus') msgStatus: messageStatus,
	@Body('targetId') userTargetId: number) {
		return await this.channelsService.addContentInvitation(channelId, userTargetId, userAuthId, msgStatus)
	}

	// Retourne tout les channels PUBLIC et PROTECTED
	@Get('accessibles')
	async findAllAccessibles() {
		return await this.channelsService.findAllChannelsAccessibles()
	}

	// Retourne un channel avec ses relations
	@Get(':id/relations')
	findWithRelations(@getUser('id') userId: number, 
	@Param('id', ParseIntPipe) channelId: number) {
		return this.channelsService.findChannelWithRelations(channelId, userId)
	}

	// Modifie un channel
	@Patch(':id')
	@UseInterceptors(FileInterceptor('file'))
	async update(@getUser('id') userId: number,
	@Param('id', ParseIntPipe) channelId: number, 
	@Body('newDatas') newChannelDatas: string,
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
		const newDatas: UpdateChannelDto = JSON.parse(newChannelDatas)
		await this.channelsService.parseMultiPartUpdate(newDatas)

		return this.channelsService.updateChannel(channelId, newDatas, userId, file)
	}

	// Change le role d'un user du channel
	@Patch(':channelId/role/:userTargetId')
	updateRole(@getUser() { id: userAuthId, username: userAuthName }: Partial<User>,
	@Param('channelId', ParseIntPipe) channelId: number,
	@Param('userTargetId', ParseIntPipe) userTargetId: number,
	@Body() { role: newRole }: UpdateRoleDto) {
		return this.channelsService.updateUserRole(channelId, userAuthId, userAuthName, userTargetId, newRole)
	}

	// Mute un user du channel
	@Patch(':channelId/mute/:userTargetId')
	updateMute(@getUser() { id: userAuthId, username: userAuthName }: Partial<User>,
	@Param('channelId', ParseIntPipe) channelId: number,
	@Param('userTargetId', ParseIntPipe) userTargetId: number) {
		return this.channelsService.updateUserMute(channelId, userTargetId, userAuthId, userAuthName)
	}

	// Change le statut d'une invitation
	@Patch(':channelId/message/:messageId')
	updateStatusChannel(@getUser('id') userAuthId: number,
	@Param('channelId', ParseIntPipe) channelId: number,
	@Param('messageId', ParseIntPipe) messageId: number,
	@Body('newStatus') newStatus: challengeStatus) {
		return this.channelsService.updateMessageStatus(channelId, messageId, userAuthId, newStatus)
	}

	// Supprime un channel
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) channelId: number) {
		return this.channelsService.remove(channelId)
	}

	// Retire un user d'un channel
	@Delete(':channelId/leave/:userTargetId')
	leave(@getUser() { id: userAuthId, username: userAuthName }: Partial<User>,
	@Param('channelId', ParseIntPipe) channelId: number,
	@Param('userTargetId', ParseIntPipe) userTargetId: number) {
		return this.channelsService.leaveChannel(channelId, userAuthId, userAuthName, userTargetId)
	}
}

/* =========================== PAS UTILISEES ================================ */

//   // Retourne tout les channels
//   @Get()
//   async findAll() {
//     const channels = await this.channelsService.findAllChannels();
//     return channels;
//   }

//   // Retourne un channel
//   @Get(':id')
//   find(@Param('id', ParseIntPipe) channelId: number,
//     @getUser('id') userId: number) {
//     return this.channelsService.findChannel(channelId, userId);
//   }

  /* soso obtenir tout les messages  edit : format de renvoie pas encore confirmer */

  // @Get(':id/message') // a acorder
  // getMessages(
  //   @Param('id', ParseIntPipe) id: number) {
  //   return this.channelsService.getAllMessage(id);
  // }

//   // Retourne les sockets (string) des users
//   @Get(':id/sockets')
//   async findSockets(
//     @Param('id', ParseIntPipe) id: number) {
//     return await this.channelsService.getAllSocketsChannel(id);
//   }

//   @Patch('add/:user/in/:chan')
//   addUser(@Param('user', ParseIntPipe) user: number,
//   @Param('chan', ParseIntPipe) chan: number,
//   @Request() member: User) {
//     return this.channelsService.addUserInChannel(user, member, chan);
//   }