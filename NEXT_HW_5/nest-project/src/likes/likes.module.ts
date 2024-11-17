import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { User } from '../users/user.entity';
import { Board } from '../boards/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Board])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}