import { Module } from '@nestjs/common'
import { PongGateway} from './pong.gateway'
import { PongService } from './pong.service'
import { UsersService } from 'src/auth/services/users.service'

import { AppGateway } from 'src/app.gateway'
import { AppService } from 'src/app.service'
import { PongController } from './pong.controller'

@Module({
    providers: [
        PongGateway,
        PongService,
        UsersService,
        AppService,
        AppGateway
    ],
    controllers: [PongController],
    exports: [PongGateway],

})

export class PongModule {}