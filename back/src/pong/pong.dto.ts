import { Game, GameStatus, Invitation, UsersOnGames, Message, Role } from "@prisma/client"
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePongDto implements Game {
	
	id:         number;
	
	createdAt:  Date;

    @IsEnum(GameStatus)
	status:     GameStatus;
	
	@IsOptional()
    @IsNumber()
	level:      number;

	invitation: Invitation[];
  
	players:    UsersOnGames[];
	
  }