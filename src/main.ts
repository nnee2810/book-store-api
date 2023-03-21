import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory, Reflector } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { EnvPayload } from "./interfaces/env-payload.interface"
import { JwtGuard } from "./modules/auth/guards/jwt.guard"
import { RolesGuard } from "./modules/auth/guards/roles.guard"
import { PrismaService } from "./modules/prisma/prisma.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })
  const reflector = app.get(Reflector)
  const configService: ConfigService<EnvPayload> = app.get(ConfigService)
  const prismaService = app.get(PrismaService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalGuards(new JwtGuard(reflector))
  app.useGlobalGuards(new RolesGuard(reflector))

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("book-store-manage-api")
      .addBearerAuth()
      .build(),
  )
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await prismaService.enableShutdownHooks(app)
  await app.listen(configService.get<number>("PORT"))
}
bootstrap()
