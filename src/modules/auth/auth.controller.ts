import { Body, Controller, Get, Post } from "@nestjs/common"
import { UnauthorizedException } from "@nestjs/common/exceptions"
import { JwtService } from "@nestjs/jwt/dist"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { User } from "@prisma/client"
import { IgnoreCache } from "src/decorators/ignore-cache.decorator"
import { handleErrorException } from "src/helpers/handleErrorException"
import { exclude } from "src/utils/exclude"
import { CurrentUser } from "../../decorators/current-user.decorator"
import { PublicRoute } from "../../decorators/public-route.decorator"
import { AuthService } from "./auth.service"
import { SignInDto } from "./dto/sign-in.dto"

@ApiTags("auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @PublicRoute()
  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    try {
      const user = await this.authService.findUser(data)
      if (!user)
        throw new UnauthorizedException(
          "Tài khoản hoặc mật khẩu không chính xác",
        )
      return {
        user,
        token: this.jwtService.sign({
          id: user.id,
        }),
      }
    } catch (error) {
      handleErrorException(error)
    }
  }

  @IgnoreCache()
  @Get("check")
  check(@CurrentUser() user: User) {
    return exclude(user, ["password"])
  }
}
