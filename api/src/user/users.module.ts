import { IsExist } from '@/common/validate/is-exists.validator';
import { IsNotExist } from '@/common/validate/is-not-exists.validator';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [IsExist, IsNotExist, UserService],
  exports: [UserService],
})
export class UserModule {}
