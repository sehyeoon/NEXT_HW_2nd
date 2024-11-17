import {
    ConflictException,
    Injectable,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Like } from './like.entity';
  import { User } from '../users/user.entity';
  import { Board } from '../boards/board.entity';
  
  @Injectable()
  export class LikesService {
    constructor(
      @InjectRepository(Like)
      private likeRepository: Repository<Like>,
  
      @InjectRepository(User)
      private userRepository: Repository<User>,
  
      @InjectRepository(Board)
      private boardRepository: Repository<Board>,
    ) {}
  
    // POST
    async addLike(
      userId: number,
      boardId: number,
    ): Promise<{ user: User; board: Board }> {
      try {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('사용자가 존재하지 않습니다.');
        }
  
        const board = await this.boardRepository.findOne({
          where: { id: boardId },
        });
        if (!board) {
          throw new NotFoundException('게시판이 존재하지 않습니다.');
        }
  
        // 이미 좋아요를 눌렀는지 확인
        const existingLike = await this.likeRepository.findOne({
          where: { user: { id: userId }, board: { id: boardId } },
        });
        if (existingLike) {
          throw new ConflictException('이미 좋아요를 누른 게시물입니다.');
        }
  
        const like = this.likeRepository.create({ user, board });
        await this.likeRepository.save(like);
        return { user, board };
      } catch (error) {
        if (
          error instanceof NotFoundException ||
          error instanceof ConflictException
        ) {
          throw error;
        } else {
          throw new InternalServerErrorException(
            '좋아요 추가 중 오류가 발생했습니다.',
          );
        }
      }
    }
  
    // DELETE
    async removeLike(
      userId: number,
      boardId: number,
    ): Promise<{ user: User; board: Board }> {
      try {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('사용자가 존재하지 않습니다.');
        }
  
        const board = await this.boardRepository.findOne({
          where: { id: boardId },
        });
        if (!board) {
          throw new NotFoundException('게시판이 존재하지 않습니다.');
        }
  
        const like = await this.likeRepository.findOne({
          where: { user: { id: userId }, board: { id: boardId } },
        });
        if (!like) {
          throw new NotFoundException('좋아요 기록이 존재하지 않습니다.');
        }
  
        await this.likeRepository.remove(like);
        return { user, board };
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          throw new InternalServerErrorException(
            '좋아요 취소 중 오류가 발생했습니다.',
          );
        }
      }
    }
  
    // GET
    async getLikes(boardId: number): Promise<User[]> {
      try {
        const board = await this.boardRepository.findOne({
          where: { id: boardId },
        });
        if (!board) {
          throw new NotFoundException('게시판이 존재하지 않습니다.');
        }
  
        const likes = await this.likeRepository.find({
          where: { board: { id: boardId } },
          relations: ['user'],
        });
  
        return likes.map((like) => like.user);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        } else {
          throw new InternalServerErrorException(
            '좋아요 추가 중 오류가 발생했습니다.',
          );
        }
      }
    }
  }