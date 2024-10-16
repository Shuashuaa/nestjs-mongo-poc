import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';

const envFile = `.env.${process.env.NODE_ENV}`;

if (!fs.existsSync(envFile)) {
  throw new Error(`❌ Environment file "${envFile}" not found!`);
}

class EnvironmentVariables {
  @IsString()
  MONGODB_URI: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFile,
      validate: (config: Record<string, unknown>) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: true,
        });
        const errors = validateSync(validatedConfig, { skipMissingProperties: false });
        if (errors.length > 0) {
          throw new Error(`❌ Invalid environment configuration: ${errors}`);
        }
        return validatedConfig;
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
    // .exclude("/users")
    // .forRoutes({ path: '*', method: RequestMethod.POST});
    .forRoutes('*');
    // consumer.apply(AuthMiddleware).forRoutes({ path: '/users', method: RequestMethod.GET});
  }
}
