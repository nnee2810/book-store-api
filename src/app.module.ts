import { CacheModule, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_INTERCEPTOR } from "@nestjs/core"
import * as redisStore from "cache-manager-redis-store"
import * as Joi from "joi"
import { CustomCacheInterceptor } from "./interceptors/custom-cache.interceptor"
import { EnvPayload } from "./interfaces/env-payload.interface"
import { AuthModule } from "./modules/auth/auth.module"
import { OrdersModule } from "./modules/orders/orders.module"
import { PrismaModule } from "./modules/prisma/prisma.module"
import { ProductsModule } from "./modules/products/products.module"
import { StatsModule } from "./modules/stats/stats.module"
import { UsersModule } from "./modules/users/users.module"

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object<EnvPayload, true>({
        PORT: Joi.number().required(),

        JWT_SECRET_KEY: Joi.string().required(),

        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),

        RABBITMQ_DEFAULT_USER: Joi.string().required(),
        RABBITMQ_DEFAULT_PASS: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_PORT: Joi.number().required(),
        RABBITMQ_URL: Joi.string().required(),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvPayload>) => ({
        store: redisStore,
        host: configService.get<string>("REDIS_HOST"),
        port: configService.get<string>("REDIS_PORT"),
        ttl: 10,
      }),
    }),
    AuthModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    StatsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
  ],
})
export class AppModule {}
