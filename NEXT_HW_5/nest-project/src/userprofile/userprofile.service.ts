import { CreateUserProfileDto } from './dto/create-userprofile.dto';
import { UpdateUserProfileDto } from './dto/update-userprofile.dto';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from './userprofile.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserprofileService {
  constructor(
    @InjectRepository(UserProfile)
    private userprofileRepository: Repository<UserProfile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // POST
  async create(
    userId: number,
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    try {
      // 유저가 존재하는지 확인
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('유저가 존재하지 않습니다.');
      }

      // 유저 프로필이 이미 존재하는지 확인
      const existingProfile = await this.userprofileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (existingProfile) {
        throw new ConflictException('유저의 프로필이 이미 존재합니다.');
      }

      // 프로필 생성 및 저장
      const userProfile: UserProfile = this.userprofileRepository.create({
        ...createUserProfileDto,
        user,
      });

      return await this.userprofileRepository.save(userProfile);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          '프로필 생성 중 오류가 발생했습니다.',
        );
      }
    }
  }

  // GET
  async findOne(username: string): Promise<UserProfile> {
    try {
      if (!username) {
        throw new BadRequestException('username이 존재하지 않습니다.');
      }

      const userProfile = await this.userprofileRepository.findOne({
        where: { user: { username } },
      });
      if (!userProfile) {
        throw new NotFoundException(
          `'${username}'에 대한 프로필이 존재하지 않습니다.`,
        );
      }

      return userProfile;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          '프로필 조회 중 오류가 발생했습니다.',
        );
      }
    }
  }

  // PATCH
  async update(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    try {
      const userProfile = await this.findOneByUserId(userId);
      if (!userProfile) {
        throw new NotFoundException(
          `해당 유저에 대한 유저 프로필이 존재하지 않습니다.`,
        );
      }

      Object.assign(userProfile, updateUserProfileDto);
      return await this.userprofileRepository.save(userProfile);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          '프로필 업데이트 중 오류가 발생했습니다.',
        );
      }
    }
  }

  // ID 기준 조회용
  async findOneByUserId(userId: number): Promise<UserProfile> {
    try {
      if (!userId) {
        throw new BadRequestException('존재하지 않는 유저 ID입니다.');
      }

      const userProfile = await this.userprofileRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!userProfile) {
        throw new NotFoundException(
          `'${userId}'에 대한 유저프로필이 존재하지 않습니다.`,
        );
      }

      return userProfile;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          '프로필 조회 중 오류가 발생했습니다.',
        );
      }
    }
  }
}