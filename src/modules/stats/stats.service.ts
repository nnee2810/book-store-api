import { Injectable } from "@nestjs/common"
import { OrderStatus, Prisma } from "@prisma/client"
import * as moment from "moment"
import { PrismaService } from "../prisma/prisma.service"
import { GetStatsDto, StatsTimeMode } from "./dto/get-stats.dto"

@Injectable()
export class StatsService {
  constructor(private prismaService: PrismaService) {}

  findAll({ timeMode, timeValue }: GetStatsDto) {
    const where: Prisma.OrderWhereInput = {
      status: OrderStatus.PAID,
    }
    if (timeMode === StatsTimeMode.DATE)
      where.createdAt = {
        gte: moment(timeValue).startOf("date").toISOString(),
        lte: moment(timeValue).endOf("date").toISOString(),
      }
    if (timeMode === StatsTimeMode.WEEK)
      where.createdAt = {
        gte: moment(timeValue).startOf("week").toISOString(),
        lte: moment(timeValue).endOf("week").toISOString(),
      }
    if (timeMode === StatsTimeMode.MONTH)
      where.createdAt = {
        gte: moment(timeValue).startOf("month").toISOString(),
        lte: moment(timeValue).endOf("month").toISOString(),
      }
    return this.prismaService.order.findMany({
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      where,
    })
  }
}
