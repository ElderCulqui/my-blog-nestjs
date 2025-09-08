import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The title of the post' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The content of the post' })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The cover image of the post' })
  coverImage?: string;


  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The summary of the post' })
  summary?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];
}
