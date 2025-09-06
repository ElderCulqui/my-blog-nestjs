import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll() {
    const posts = await this.postsRepository.find({
      relations: ['user.profile', 'categories']
    });
    return posts;
  }

  async getPostById(id: number) {
    const post = await this.findOne(id);
    return post;
  }

  async create(body: CreatePostDto) {
    try {
      const newPost = await this.postsRepository.save({
        ...body,
        user: { id: body.userId },
        categories: body.categoryIds?.map((id) => ({ id }))
      });
      return this.findOne(newPost.id);
    } catch (error) {
      throw new BadRequestException('Error creating post');
    }
  }

  async update(id: number, body: UpdatePostDto) {
    try {
      const post = await this.findOne(id);
      const updatedPost = this.postsRepository.merge(post, body);
      const savedPost = await this.postsRepository.save(updatedPost);
      return savedPost;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    try {
      await this.postsRepository.delete(id);
      return { message: 'Post deleted' };
    } catch (error) {
      throw new BadRequestException('Error deleting post');
    }
  }

  findOne(id: number) {
    return this.findPostById(id);
  }

  remove(id: number) {
    return this.delete(id);
  }

  private async findPostById(id: number) {
    const post = await this.postsRepository.findOne({ 
      where: { id },
      relations: ['user.profile', 'categories']
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }
}
