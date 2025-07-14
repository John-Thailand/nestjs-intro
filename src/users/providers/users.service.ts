import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public findAll(
    getuserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);

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

  public findOneById(id: string) {
    return {
      id: 1234,
      fistName: 'naoki',
      email: 'naoki@honda.com',
    };
  }
}
