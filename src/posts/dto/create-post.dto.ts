import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];
}
