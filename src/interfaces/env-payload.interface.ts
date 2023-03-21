export interface EnvPayload {
  PORT: number

  JWT_SECRET_KEY: string

  POSTGRES_HOST: string
  POSTGRES_PORT: number
  POSTGRES_USERNAME: string
  POSTGRES_PASSWORD: string
  POSTGRES_DATABASE: string
  DATABASE_URL: string

  REDIS_HOST: string
  REDIS_PORT: number

  RMQ_USER: string
  RMQ_PASS: string
  RMQ_HOST: string
  RMQ_PORT: number
  RMQ_URL: string
}
