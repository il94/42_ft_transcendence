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

    // create a game : boutton start a match
    // @Post()
    // create(@getUser() user: User): Promise<Game> {
    //     return this.pongService.createGame(user.id)
    // }

    // // jouer contre quelqu'un
    // @Post('play/:id')
    // play(@Param('id', ParseIntPipe) gameId: number, @getUser() user: User): Promise<Game>  {
    //     return this.pongService.playGame(user.id, gameId)
    // }

    // // boutton : jouer 
    // @Post('play')
    // playRandom(@getUser() user: User): Promise<Game>  {
    //     return this.pongService.playRandomGame(user.id)
    // }

    // @Post('watch/:id')
    // watch(@Param('id', ParseIntPipe) gameId: number, @getUser() user: User): Promise<Game>  {
    //     return this.pongService.watchGame(user.id, gameId)
    // }

    // @Get(':id')
    // getById(@Param('id', ParseIntPipe) gameId: number): Promise<Game>  {
    //     return this.pongService.getGameById(gameId)
    // }

 }