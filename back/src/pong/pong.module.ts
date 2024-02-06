
import { Module } from '@nestjs/common'
import { PongGateway} from './pong.gateway'
import { PongController } from './pong.controller'
import { AppService } from 'src/app.service'
import { PongService } from './pong.service'
import { UsersService } from 'src/auth/services/users.service'
import { AppGateway } from 'src/app.gateway'

@Module({
	providers: [
		PongGateway,
		PongService,
		UsersService,
		AppService,
		AppGateway
	],
	controllers: [PongController]
})

export class PongModule {}