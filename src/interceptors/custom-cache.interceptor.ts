import { CacheInterceptor, ExecutionContext } from "@nestjs/common"

export class CustomCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const ignoreCache: boolean = this.reflector.get(
      "ignoreCache",
      context.getHandler(),
    )

    if (ignoreCache) return false
    return request.method === "GET"
  }
}
