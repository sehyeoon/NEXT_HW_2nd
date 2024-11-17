import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserprofileController } from './userprofile.controller';
import { UserprofileService } from './userprofile.service';
import { UsersModule } from '../users/users.module';
import { UserProfile } from './userprofile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile]),
    UsersModule, // UsersModule 추가
  ],
  controllers: [UserprofileController],
  providers: [UserprofileService],
  exports: [UserprofileService],
})
export class UserprofileModule {}