import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { CreatePongDto } from './pong.dto'
import { Game, User, GameStatus, Role, Prisma, messageStatus, challengeStatus, roleInGame, UserStatus, MatchResult  } from '@prisma/client';
import { Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { ESLint } from 'eslint';
import { PongGame } from './game'
import { AppGateway } from 'src/app.gateway';
import { UsersService } from 'src/auth/services/users.service';


@UseGuards(JwtGuard)
@Injectable()
export class PongService {

	public activeGames: PongGame[] = [];

	constructor
	(
		private prisma: PrismaService,
		private appGateway: AppGateway,
		private userService: UsersService,
		private appService: AppService,
		) {}
	

	async updateStatusUser(idUser : number, newStatus: UserStatus)
	{
		await this.prisma.user.update({ where: { id: idUser},
			data: { status: newStatus }
		 })
		 this.appGateway.server.emit("updateUserStatus", idUser, newStatus);
	}

	async createGame(userOneId: number, userTwoId: number): Promise<number> {
		console.log("create new game")
		const game = await this.prisma.game.create({
			data: {
				level: 1,
				status: GameStatus.PENDING,
				players: {
					create: [{ 
						score: 0,
						result: 'DRAW',
						role: roleInGame.PLAYER,
						userId: userOneId},
						{ 
						  score: 0,
						  result: 'DRAW',
						  role: roleInGame.PLAYER,
						  userId: userTwoId}
					  
					  ]
				}
			}
		})
		this.updateStatusUser(userOneId, UserStatus.PLAYING); // change les status des joeuer manque les emit
		this.updateStatusUser(userTwoId, UserStatus.PLAYING);
		console.log("NEW game: ", game);
		return game.id; 
	}


	// patch pour dire que la game est finie
	async updateGameStatus(gameId: number, newStatus: GameStatus): Promise<Game | null> {
		try {
		  const existingGame = await this.prisma.game.findUnique({
			where: { id: gameId },
		  });
	
		  if (!existingGame) {
			throw new Error('Game not found');
		  }
	
		  const updatedGame = await this.prisma.game.update({
			where: { id: gameId },
			data: { status: newStatus },
		  });

		  return updatedGame;
		} catch (error) {
		  console.error('Error updating game status:', error);
		  throw error;
		}
	  }
		

	  async updateUserGameStats(userId: number, gameId: number, score: number, result: MatchResult) {
		try {
		// check si game exist
		// check si le user existe dans le server
		// check si le user se trouve dans la game 
		  const updatedUserGame = await this.prisma.usersOnGames.update({
			where: {
			  userId_gameId: {
				userId: userId,
				gameId: gameId
			  }
			},
			data: {
			  score: score,
			  result: result
			} as Prisma.UsersOnGamesUpdateInput
		  });
		  console.log(`User ${userId} game stats updated successfully.`);
		  this.updateStatusUser(userId, UserStatus.ONLINE);
		  this.setResult(userId, result); // set user match history  
		  return updatedUserGame;
		} catch (error) {
		  console.error(`Error updating user ${userId} game stats:`, error);
		  throw error;
		}
	  }

























	  async setResult(userId: number, result: MatchResult): Promise<void> {
		try {
			const user = await this.prisma.user.findUnique({where: { id: userId }})	
			if (result == MatchResult.WINNER) {
				await this.prisma.user.update({ where: { id: userId },
					data: { wins: { increment: 1 } }
				})
				user.wins++
			}
			else if (result == MatchResult.LOOSER) {
				await this.prisma.user.update({ where: { id: userId },
					data: { losses: { increment: 1 } }
				})
				user.losses++
			}
		} catch (error) {
			throw error
		}
	}

// 		// util
// 		async connectGame(userId: number, gameId: number, userRole: roleInGame): Promise<Game> {
// 			try {
// 				const connectGame = await this.prisma.game.update({
// 					where: { id: gameId },
// 					data: {
// 						players: {
// 							create: [{ role: userRole, result: 'DRAW', userId: userId }],
// 							connect: { userId_gameId: {
// 								userId: userId,
// 								gameId: gameId
// 							}}
// 						}
// 					}
// 				})
// 				if (!connectGame)
// 				throw new NotFoundException(`Failed to update game ${gameId}`)
// 			await this.prisma.user.update({ where: { id: userId},
// 				data: { status: UserStatus.WAITING }
// 			})
// 			return connectGame
// 		} catch (error) {
// 			throw error.message
// 		}
// 	}
	
// 	// to play
// 	async playGame(userId: number, gameId: number): Promise<Game> {
// 		try {
// 			// const countUsers = await this.prisma.game.findUnique({ where: { id: gameId},
// 			//     include: {        
// 				//         _count: {
// 					//             select: { players:  true }
// 					//         }
// 					// }})
// 					const countPlayers = await this.prisma.usersOnGames.count({
// 						where: {
// 							gameId: gameId,
// 							role: 'PLAYER',
// 						},
// 					});
// 					if (!countPlayers)
// 					throw new NotFoundException('Game to join not found')
// 				if (countPlayers === 1) {
// 					const joinGame = await this.connectGame(userId, gameId, roleInGame.PLAYER);
// 					// match playing
// 					await this.prisma.game.update({
// 						where: { id: joinGame.id },
// 						data: { status: GameStatus.PLAYING }
// 					})
// 					// user playing
// 					await this.prisma.user.update({ where: { id: userId},
// 						data: { status: UserStatus.PLAYING }
// 					})
// 					return joinGame;
// 				}
// 				else
// 				throw new UnauthorizedException('error joining a game')
// 		} 
// 		catch (error) {
// 			throw error.message
// 		}
// 	}
	
// 	async playRandomGame(userId: number): Promise <Game> {
// 		try {
// 			const game = await this.prisma.game.findFirst({ where: { status: GameStatus.PENDING }})
// 			if (!game) {
// 				const newGame = await this.createGame(userId)
// 				return newGame;
// 			}
// 			const playGame = await this.playGame(userId, game.id)
// 			await this.prisma.user.update({ where: { id: userId},
// 				data: { status: UserStatus.PLAYING }
// 			})
// 			return playGame;
// 		} catch (error) {
// 			throw error.message
// 		}
// 	}
	
// 	// to watch
// 	async watchGame(userId: number, gameId: number): Promise<Game> {
// 		try {
// 			const game = await this.prisma.game.findUnique({ where: { id: gameId, 
// 				status: GameStatus.PLAYING }})
// 				if (!game)
// 				throw new NotFoundException('Game to watch not found')
// 			const joinGame = await this.connectGame(userId, gameId, roleInGame.WATCHER);
// 			if (!joinGame)
// 			throw new NotFoundException('Failed to join game to watch')
// 		await this.prisma.user.update({ where: { id: userId},
//             data: { status: UserStatus.WATCHING }
//         })
//         return joinGame;
//     } catch (error) {
// 		throw error
//     }
// }

// async getGameById(gameId: number): Promise <Game> {
// 	try {
// 		const game = await this.prisma.game.findUnique({ where: { id: gameId }})
//         if (!game)
// 		throw new BadRequestException('Game not found')
// 	return game
// } catch (error) {
// 	throw error.message
// }
// }

// @UseGuards(JwtGuard)
// @Injectable()
// export class PongService {

// 	private activeGames: PongGame[] = [];


//   // util
//   async connectGame(userId: number, gameId: number, userRole: roleInGame, userStatus: UserStatus): Promise<Game> {
//     try {
//         //console.log("userRole ", userRole)
//         const connectGame = await this.prisma.game.update({
//             where: { id: gameId },
//             data: {
//                 players: {
//                     connect: { userId_gameId: {
//                         userId: userId,
//                         gameId: gameId
//                     }},
                
//                 }
//             }
//         })
//         const players =  await this.prisma.usersOnGames.findUnique({ where: { userId_gameId: { userId: userId, gameId: gameId } }})
//         console.log("connectGame: ", players)


//         if (!connectGame)
//             throw new NotFoundException(`Failed to update game ${gameId}`)
//         await this.prisma.user.update({ where: { id: userId},
//             data: { status:  userStatus}
//         })
//         return connectGame
//     } catch (error) {
//         throw error.message
//     }
//   }

//   // to play
//   async playGame(userId: number, gameId: number): Promise<Game> {
//     try {
//         const countPlayers = await this.prisma.usersOnGames.count({
//             where: {
//               gameId: gameId,
//               role: 'PLAYER',
//             },
//         });
//         if (!countPlayers)
//             throw new NotFoundException('Game to join not found')
//         if (countPlayers === 1) {
//             const joinGame = await this.connectGame(userId, gameId, roleInGame.PLAYER, UserStatus.PLAYING);
//             console.log("count: ", countPlayers)
//             // match playing
//             await this.prisma.game.update({
//                 where: { id: joinGame.id },
//                 data: { status: GameStatus.PLAYING }
//             })
//             // user playing
//             //await this.prisma.user.update({ where: { id: userId},
//             //   data: { status: UserStatus.PLAYING }
//            // })
//             return joinGame;
//         }
//         else
//             throw new UnauthorizedException('error joining a game')
//     } 
//     catch (error) {
//         throw error.message
//     }
//   }

//   async playRandomGame(userId: number): Promise <Game> {
//     try {
//         const game = await this.prisma.game.findFirst({ where: { status: GameStatus.PENDING }})
//         if (!game) {
//             const newGame = await this.createGame(userId)
//             return newGame;
//         }
//         console.log("GAME ICI: ", game)
//         const playGame = await this.playGame(userId, game.id)
//        // await this.prisma.user.update({ where: { id: userId},
//         //    data: { status: UserStatus.PLAYING }
//        // })
//         return playGame;
//     } catch (error) {
//         throw error
//     }
//   }

//   // to watch
//   async watchGame(userId: number, gameId: number): Promise<Game> {
//     try {
//         const game = await this.prisma.game.findUnique({ where: { id: gameId, 
//             status: GameStatus.PLAYING }})
//         if (!game)
//             throw new NotFoundException('Game to watch not found')
//         const joinGame = await this.connectGame(userId, gameId, roleInGame.WATCHER, UserStatus.WATCHING);
//         if (!joinGame)
//         throw new NotFoundException('Failed to join game to watch')
//         await this.prisma.user.update({ where: { id: userId},
//             data: { status: UserStatus.WATCHING }
//         })
//         return joinGame;
//     } catch (error) {
//         throw error
//     }
//   }

//   async getGameById(gameId: number): Promise <Game> {
//     try {
//         const game = await this.prisma.game.findUnique({ where: { id: gameId }})
//         if (!game)
//             throw new BadRequestException('Game not found')
//         return game
//     } catch (error) {
//         throw error.message
//     }
//   }

//   async remove(id: number): Promise<Game> {
//     const deletePlayers = this.prisma.usersOnGames.deleteMany({
//         where: { userId: id }})
//     const transaction = await this.prisma.$transaction([deletePlayers])
//     const userExists = await this.prisma.game.findUnique({
//         where: { id: id },});
//     if (userExists) {
//         const deleteGame = this.prisma.game.delete({
//             where: { id: id },});
//         return deleteGame;
//     } else {
//         throw new Error(`Failed to remove game`);
//     }
// }
// data[0] senderID
// data[1] enemyID



}