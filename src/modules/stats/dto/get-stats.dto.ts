import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString } from "class-validator"

export enum StatsTimeMode {
  DATE = "DATE",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

export class GetStatsDto {
  @ApiProperty()
  @IsEnum(StatsTimeMode)
  timeMode: StatsTimeMode

  @ApiProperty()
  @IsString()
  timeValue: string
}
