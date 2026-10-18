import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/users.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
