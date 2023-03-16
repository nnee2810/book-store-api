import { HttpException, InternalServerErrorException } from "@nestjs/common"

export function handleErrorException(error: any) {
  if (error instanceof HttpException)
    throw new HttpException(error.message, error.getStatus())
  throw new InternalServerErrorException(error?.message)
}
