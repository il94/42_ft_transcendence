
import { Module } from '@nestjs/common'
import { PongGateway} from './pong.gateway'
import { PongController } from './pong.controller'
import { AppService } from 'src/app.service'
import { PongService } from './pong.service'
import { UsersService } from 'src/auth/services/users.service'

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