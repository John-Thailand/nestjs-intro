import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthCllient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly generateTokensProvicer: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthCllient = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    try {
      // verify the google token sent by user
      const loginTicket = await this.oauthCllient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // extract the payload from google jwt
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();
      // find the user in the database using the googleId
      const user = await this.usersService.findOneByGoogleId(googleId);
      // if googleId exists generate token
      if (user) {
        return this.generateTokensProvicer.generateTokens(user);
      }
      // if not create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        googleId: googleId,
      });
      return this.generateTokensProvicer.generateTokens(newUser);
    } catch (error) {
      // throw unauthorized exception
      throw new UnauthorizedException(error);
    }
  }
}
