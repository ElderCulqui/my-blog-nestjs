import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { OpenaiService } from '../../ai/services/openai.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private openaiService: OpenaiService
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

  async create(body: CreatePostDto, userId: number) {
    try {
      const newPost = await this.postsRepository.save({
        ...body,
        user: { id: userId },
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

  async publish(id: number, userId: number) {
    const post = await this.findOne(id);
    if (post.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to publish this post');
    }
    if(!post.content || !post.title || post.categories.length === 0 ) {
      throw new BadRequestException('Post content, title and al least one category are required');
    }

    const summary = await this.openaiService.generateSummary(post.content);
    const image = await this.openaiService.generateImage(summary);
    const changes = this.postsRepository.merge(post, { 
      isDraft: false,
      summary,
      coverImage: image
    });
    const updatedPost = await this.postsRepository.save(changes);
    return this.findOne(updatedPost.id)
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
