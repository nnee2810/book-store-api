import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UserRole } from "@prisma/client"
import { RequestWithUser } from "../../../decorators/current-user.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles) return true

    const user = context.switchToHttp().getRequest<RequestWithUser>().user
    return roles.includes(user.role)
  }
}
