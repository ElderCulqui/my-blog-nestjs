import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({
      relations: ['profile']
    });
    return users;
  }

  async getUserById(id: number) {
    const user = await this.findOne(id);
    return user;
  }

  async getProfileByUserId(id: number) {
    const user = await this.findOne(id);
    return user.profile
  }

  async getPostsByUserId(id: number) {
    const user = await this.findOne(id, ['profile', 'posts'])
    return user;
  }

  async create(body: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(body);
      return newUser;
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async update(id: number, body: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updatedUser = this.usersRepository.merge(user, body);
      const savedUser = await this.usersRepository.save(updatedUser)
      return savedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    try {
      await this.usersRepository.delete(id);
      return { message: 'User deleted'};
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
  }

  private async findOne(id: number, relations: string[] = ['profile']) {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: relations
     });
    if (! user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
