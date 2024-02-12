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
import { ChannelsService } from 'src/channels/channels.service';


@UseGuards(JwtGuard)
@Injectable()
export class PongService {

	public activeGames: PongGame[] = [];

	constructor
	(
		private prisma: PrismaService,
		private appGateway: AppGateway,
		private userService: UsersService,
		private appService : AppService,
		//private channelService: ChannelsService
		) {}
		
	async getUserStatus(idUser: number)
	{
		try {
			const userStatus = await this.prisma.user.findUnique({
				where: {
					id : idUser
				},
				select: {
					status : true
				}
			})
			if (!userStatus)
				throw new Error('userstatus not found')
			return userStatus.status
		} catch (error) {
			throw error
		}
	}

	async updateStatusUser(idUser : number, newStatus: UserStatus)
	{
		
		await this.prisma.user.update({ where: { id: idUser},
			data: { status: newStatus }
		})
		if (newStatus !== UserStatus.ONLINE)
			await this.cancelAllInvitation(idUser)
		this.appGateway.server.emit("updateUserStatus", idUser, newStatus);
		
	}


	async setInvitationAsFinished(messageId: number)
	{	
		try {
			const channelId = await this.prisma.message.findUnique({
				where: {
					id: messageId
				},
				select: {
					channelId: true
				}
			})

			await this.prisma.message.update({
				where: {
					id: messageId
				},
				data: {
					status: challengeStatus.FINISHED
				}

			})

			// console.log(channelId, messageId, challengeStatus.FINISHED)
			await this.appService.emitOnChannel("updateChallenge", channelId.channelId, messageId, challengeStatus.FINISHED)
		} catch (error) {
			
		}


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
		  console.error('Error while updating game status:', error);
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
		  console.log(`User ${userId} game stats has been updated successfully.`);
		  this.updateStatusUser(userId, UserStatus.ONLINE);
		  this.setResult(userId, result); // set user match history  
		  return updatedUserGame;
		} catch (error) {
		  console.error(`Error while updating user ${userId} game stats:`, error);
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

	  async challengeStatusMessage(idMsg: number, idChan: number) {
		try {
			const existingMessage = await this.prisma.message.findUnique({
				where: {
					id: idMsg,
				},
			});
	
			if (!existingMessage) {
				throw new Error(`Message with ID ${idMsg} does not exist.`);
			}
	
			const updateMessage = await this.prisma.message.update({
				where: {
					id: idMsg,
				},
				data: {
					status: challengeStatus.CANCELLED,
				},
			});
			//userAuthenticate.socket?.on("updateChallenge", (channelId: number, messageId: number, newStatus: challengeStatus)
			await this.appService.emitOnChannel("updateChallenge", idChan, idMsg, challengeStatus.CANCELLED)
			// await this.emitOnChannel("updateChallenge", idChan, idMsg, challengeStatus.CANCELLED)
			if (!updateMessage)
				throw new Error(`Failed to update message with ID ${idMsg}.`);

		} catch (error) {
			throw new Error(`An error occurred while updating message with ID ${idMsg}: ${error}`);
		}
	}
	
	
	  async	cancelAllInvitation(userId : number)
	  {
		const messageAuthor = await this.prisma.message.findMany({
			where: {
				authorId: userId,
				isInvit: true,
				NOT: {
					status: {
						in : [challengeStatus.CANCELLED, challengeStatus.FINISHED, challengeStatus.IN_PROGRESS]}
				},
			},
		});
		
		const messageTarget = await this.prisma.message.findMany({
			where: {
				targetId: userId,
				NOT: {
					status: {
						in : [challengeStatus.CANCELLED, challengeStatus.FINISHED, challengeStatus.IN_PROGRESS]}
				},
			},
		});
		messageAuthor.forEach(async message => {
			await this.challengeStatusMessage(message.id, message.channelId)
		});
		messageTarget.forEach(async message => {
			await this.challengeStatusMessage(message.id, message.channelId)
		});
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