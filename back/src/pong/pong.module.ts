
import { Module } from '@nestjs/common'
import { PongGateway} from './pong.gateway'
import { PongController } from './pong.controller'
import { AppService } from 'src/app.service'
import { PongService } from './pong.service'

@Module({
	providers: [
		PongGateway,
		PongService,
		AppService
	],
	controllers: [PongController]
})

export class PongModule {}