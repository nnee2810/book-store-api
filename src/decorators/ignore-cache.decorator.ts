import { SetMetadata } from "@nestjs/common"

export const IgnoreCache = () => SetMetadata("ignoreCache", true)
