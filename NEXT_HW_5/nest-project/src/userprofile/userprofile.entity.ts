import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  @Entity()
  export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    avatarUrl: string;
  
    @Column({ nullable: true })
    bio: string;
  
    @OneToOne(() => User)
    @JoinColumn()
    user: User;
  }