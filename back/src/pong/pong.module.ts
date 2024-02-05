
import { Module } from '@nestjs/common'
import { PongGateway} from './pong.gateway'

@Module({
	providers: [
		PongGateway,
		PongService,
		UsersService,
		AppService
	],
	controllers: [PongController]
})

export class PongModule {}