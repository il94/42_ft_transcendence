import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { CreatePongDto} from './pong.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PongService } from './pong.service';
import { getUser } from '../auth/decorators/users.decorator';

import { User, challengeStatus, messageStatus, Game } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { PongGateway } from './pong.gateway';

@UseGuards(JwtGuard)
@Controller('pong')
export class PongController {

    constructor(private readonly pongService: PongService,
        private readonly pongGateway: PongGateway
        ) {}

    // @Post(':id')
    // create(
    //     @Param('id', ParseIntPipe) userTwoId: number,
    //     @getUser('id') userOneId: number
    //     ): Promise<number> {
    //     return this.pongService.createGame(userOneId, userTwoId)
    // }

    // fonction appeler lors du bouton page precedente
    @Get('back')
    async catchBackward(
        @getUser('id') userId: number
    ) {
        return await this.pongGateway.handleBack(userId)
    }

    @Patch(':id/cancel')
    async cancelAllInvitationBack(
        @Param('id', ParseIntPipe) userId: number,
    ){
        return await this.pongService.cancelAllInvitation(userId)
    }

    @Patch('spectate/:id')
    async addSpectate(
        @Param('id', ParseIntPipe) userId: number,
        @Body('userId') spectateId: number,
    ){
        return await this.pongGateway.handleSpectate(userId,spectateId)
    }

    @Patch('stopspectate/:id')
    async addStopSpectate(
        @Param('id', ParseIntPipe) userId: number,
        @Body('gameId') gameId: number,
    ){
        return await this.pongGateway.handleStopSpectate(userId, gameId)
    }
    
    @Patch('search/:id')
    async searchForAGame(
        @Param('id', ParseIntPipe) userId: number,
        @Body('dif') dif: number,
    ){
        return await this.pongGateway.addSearchingPlayer(userId, dif)
    }

    @Patch('stopsearch/:id')
    async stopSearchForAGame(
        @Param('id', ParseIntPipe) userId: number
    ){
        return await this.pongGateway.handleCancelSearching(userId)
    }

	@Patch('closeGame/')
    handleDisconnect(){
        return this.pongGateway.handlePrevArrow()
    }

}
