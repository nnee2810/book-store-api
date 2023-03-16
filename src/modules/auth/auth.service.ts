import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { SignInDto } from "./dto/sign-in.dto"

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  findUser(data: SignInDto) {
    return this.prismaService.user.findFirst({
      where: data,
    })
  }
}
