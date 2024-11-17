import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { LikesService } from './likes.service';
  import { AuthGuard } from '@nestjs/passport';
  import { Request } from 'express';
  
  @Controller('boards/:id/likes') // url 주소 동일
  export class LikesController {
    constructor(private readonly likeService: LikesService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async addLike(@Param('id') boardId: number, @Req() req: Request) {
      const userId = req.user['userId'];
      return await this.likeService.addLike(userId, boardId);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Delete()
    async removeLike(@Param('id') boardId: number, @Req() req: Request) {
      const userId = req.user['userId'];
      return await this.likeService.removeLike(userId, boardId);
    }
  
    @Get()
    async getLikes(@Param('id') boardId: number) {
      return this.likeService.getLikes(boardId);
    }
  }