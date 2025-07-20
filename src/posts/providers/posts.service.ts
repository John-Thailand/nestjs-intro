import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    // Find tags
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    // Create post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    // return the post
    return await this.postsRepository.save(post);
  }
  public async findAll(userId: number) {
    // const user = this.usersService.findOneById(userId);

    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });

    return posts;
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
}
