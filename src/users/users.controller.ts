import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    public log: Logger;
    constructor(private readonly usersService: UsersService) {
      this.log = new Logger('UsersController', { timestamp: true });
    }

    @Post('login')
    async login(@Body('password') password, @Body('username') username) {
        this.log.log(`Username -> ${username}, Password -> ${password}`);
        return this.usersService.login(password, username);
    }
}
