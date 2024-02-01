import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CreatePongDto } from './pong.dto'
import { Game, User, GameStatus, Role, Prisma, messageStatus, challengeStatus  } from '@prisma/client';
import { Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { ESLint } from 'eslint';


@UseGuards(JwtGuard)
@Injectable()
export class PongService {
  constructor(private prisma: PrismaService) {}

  async createGame(dto: CreatePongDto, creatorId: number): Promise<Game> {
    const tmp = await this.prisma.game.create({
        data: {
            level: dto.level,
            status: GameStatus.PENDING,
        }
    })
    const newGame = this.connectGame(creatorId, tmp.id)
    return newGame
  }

  async connectGame(userId: number, gameId: number): Promise<Game> {
    const connectGame = await this.prisma.game.update({
        where: { id: gameId },
        data: {
            players: {
                connect: { userId_gameId: {
                    userId: userId,
                    gameId: gameId
                }}

            }
        }
    })
    return connectGame
  }

  async joinGame(userId: number, gameId: number): Promise<Game> {
    try {
        const count = await this.prisma.game.findUnique({ where: { id: gameId},
            include: {
                _count: {
                    select: { players: true }
                }
        }})
        if (count._count.players === 1) {
            const joinGame = await this.connectGame(userId, gameId);
            await this.prisma.game.update({
                where: { id: joinGame.id },
                data: { status: GameStatus.PLAYING }
            })
            return joinGame
        }
        else
            throw new UnauthorizedException('error joining a game')
    } 
    catch (error) {
        throw error.message
    }
  }

  async getGameById(gameId: number): Promise <Game> {
    try {
        const game = await this.prisma.game.findUnique({ where: { id: gameId }})
        if (!game)
            throw new BadRequestException('Game not found')
        return game
    } catch (error) {
        throw error.message
    }
  }

}