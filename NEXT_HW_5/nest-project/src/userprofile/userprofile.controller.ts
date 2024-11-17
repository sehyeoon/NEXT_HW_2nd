import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Patch,
    Param,
    Req,
  } from '@nestjs/common';
  import { UserprofileService } from './userprofile.service';
  import { UserProfile } from './userprofile.entity';
  import { AuthGuard } from '@nestjs/passport';
  import { CreateUserProfileDto } from './dto/create-userprofile.dto';
  import { UpdateUserProfileDto } from './dto/update-userprofile.dto';
  import { Request } from 'express';
  
  @Controller('userprofile')
  export class UserprofileController {
    constructor(private readonly userprofileService: UserprofileService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
      @Body() createUserProfileDto: CreateUserProfileDto,
      @Req() req: Request,
    ): Promise<UserProfile> {
      const userId = req.user['userId'];
      return this.userprofileService.create(userId, createUserProfileDto);
    }
  
    @Get(':username')
    async findOne(@Param('username') username: string): Promise<UserProfile> {
      return this.userprofileService.findOne(username);
    }
  
    @UseGuards(AuthGuard('jwt'))
    @Patch()
    async update(
      @Body() updateUserProfileDto: UpdateUserProfileDto,
      @Req() req: Request,
    ): Promise<UserProfile> {
      const userId = req.user['userId'];
      return this.userprofileService.update(userId, updateUserProfileDto);
    }
  }