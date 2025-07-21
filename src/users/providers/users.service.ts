import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(profileConfig.KEY)
    private readonly profileConfigService: ConfigType<typeof profileConfig>,
  ) {}

  public async createuser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    // Handle exception

    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);

    return newUser;
  }

  public findAll(
    getuserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log(this.profileConfigService);

    return [
      {
        fistName: 'John',
        email: 'john@doe.com',
      },
      {
        fistName: 'naoki',
        email: 'naoki@honda.com',
      },
    ];
  }

  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
