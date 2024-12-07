import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { BlockedsService } from './blockeds.service';
import { getUser } from '../auth/decorators/users.decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CreateUserDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('blockeds')
export class BlockedsController {
	constructor(private readonly blockedsService: BlockedsService) {}

	// Bloque un user
	@Post(':id')
	addNewBlocked(@getUser('id') userAuthId: number,
	@Param('id', ParseIntPipe) userTargetId: number) {
		return this.blockedsService.addBlocked(userAuthId, userTargetId)
	}

	// Retourne les users bloques
	@Get()
	async getUserBlockeds(@getUser('id') userId: number) {
		return await this.blockedsService.getUserBlockeds(userId)
	}

	// Debloque un user
	@Delete(':id')
	removeBlocked(@getUser('id') userAuthId: number,
	@Param('id', ParseIntPipe) userTargetId: number) {
		return this.blockedsService.removeBlocked(userAuthId, userTargetId)
	}
}

/* =========================== PAS UTILISEES ================================ */

  // @Patch('update/:id')
  // updateRelation(
  //   @Param('id', ParseIntPipe) id: number, 
  //   @Body() dto: RelationDto) {
  //       return this.blockedsService.updateRelation(id, dto);
  //   }