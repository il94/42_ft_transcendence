
import { Module } from '@nestjs/common'
import { PongGateway} from './pong.gateway'
import { PongService } from './pong.service'
import { UsersService } from 'src/auth/services/users.service'
import { AppService } from 'src/app.service'
import { PongController } from './pong.controller'

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