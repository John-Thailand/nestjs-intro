import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // Create metaOptions
    const metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    // Create post
    const post = this.postsRepository.create(createPostDto);

    // Add metaOptions to the post
    if (metaOptions) {
      post.metaOptions = metaOptions;
    }

    // return the post
    return await this.postsRepository.save(post);
  }
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test Title',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test Title 2',
        content: 'Test Content 2',
      },
    ];
  }
}
