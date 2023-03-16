import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"
import { Request } from "express"

export interface RequestWithUser extends Request {
  user: User
}

export const CurrentUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user
    return data ? user[data] : user
  },
)
