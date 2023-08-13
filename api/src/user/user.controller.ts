import { Controller, Get, Version } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.find();
  }
}
