import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@WebSocketGateway()
export class GamesGateway {
  constructor(private readonly gamesService: GamesService) {}

  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @SubscribeMessage('findAllGames')
  findAll() {
    return this.gamesService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.gamesService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.gamesService.remove(id);
  }
}
