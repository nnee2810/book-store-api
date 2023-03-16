import { Controller, Get, Query } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { handleErrorException } from "src/helpers/handleErrorException"
import { GetStatsDto } from "./dto/get-stats.dto"
import { StatsService } from "./stats.service"

@ApiTags("stats")
@ApiBearerAuth()
@Controller("stats")
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  getStats(@Query() query: GetStatsDto) {
    try {
      return this.statsService.findAll(query)
    } catch (error) {
      handleErrorException(error)
    }
  }
}
