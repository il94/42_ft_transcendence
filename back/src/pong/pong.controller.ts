import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { CreatePongDto} from './pong.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PongService } from './pong.service';
import { getUser } from '../auth/decorators/users.decorator';
import { User, challengeStatus, messageStatus } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/auth.guard';

@UseGuards(JwtGuard)
@Controller('pong')
export class PongController {
    constructor(private readonly pongService: PongService) {}

    @Post()
    create(@getUser() user: User, /*@Body() dto: CreatePongDto*/) {
        return this.pongService.createGame(user.id)
    }

    @Post('join/:id')
    join(@Param('id', ParseIntPipe) gameId: number, @getUser() user: User) {
        return this.pongService.joinGame(user.id, gameId)
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) gameId: number) {
        return this.pongService.getGameById(gameId)
    }



 }