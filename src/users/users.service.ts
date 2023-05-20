import { Body, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    public log: Logger;

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        
    }

    async login(password, username) {
        let user = this.userRepository.findOneBy({
            username: username,
            password: password
        })
        if ((await user) !== null) {
            return (await user)._id;
        } else {
            return null;
        }
    } 

}
