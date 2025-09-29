
-----

# MDDLWR.md

## Middleware 🛡️

Middleware is a function invoked by the framework *before* the route handler. It can execute any code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function in the stack. NestJS middleware is equivalent to **Express middleware**.

## 1\. Functional-Based Middleware 📝

Functional middleware is a simple JavaScript function that accepts the standard Express arguments: `req`, `res`, and `next`.

### Generation

Use the Nest CLI to generate the middleware structure:

```bash
nest g middleware middlewares/logger
```

### Implementation

The middleware logs the method and URL of the incoming request.

```typescript
// middleware/logger/logger.middleware.ts

import { Request, Response } from "express";

export function LoggerMiddleware(req:Request, res:Response, next: Function){
  console.log(`Incoming Request: ${req.method}, ${req.originalUrl}`);
  next();
}
```

-----

## 2\. Class-Based Middleware (Recommended) 👩‍💻

Class-based middleware is implemented using a class that implements the `NestMiddleware` interface from `@nestjs/common`. This is the recommended approach as it allows for dependency injection.

### Generation

Generate the class-based middleware:

```bash
nest g middleware middlewares/auth --no-spec
```

### Implementation

The `AuthMiddleware` checks for an `Authorization` header. If the header is missing, it immediately ends the cycle with a `403 Forbidden` response.

```typescript
// middlewares/auth/auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['authorization'];
    if(!token) return res.status(403).json({ message: "Unauthorized"});

    // Todo: verify token logic here
    console.log(`User authenticated with token: ${token}`);
    next();
  }
}
```

-----

## 3\. Applying Middleware in `app.module.ts` ⚙️

Middleware is set up inside the application's module using the `configure` method, which is required when implementing the **`NestModule`** interface. This is done through the `MiddlewareConsumer`.

### Implementation

Here, the `AuthMiddleware` is globally applied to all routes using **`forRoutes('*')`**. The configuration also shows a more robust approach to environment variable validation using `class-validator` and `class-transformer`.

```typescript
// app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';

// Dynamic selection of the .env file
const envFile = `.env.${process.env.NODE_ENV}`;

if (!fs.existsSync(envFile)) {
  throw new Error(`❌ Environment file "${envFile}" not found!`);
}

// Class for validation
class EnvironmentVariables {
  @IsString()
  MONGODB_URI: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFile,
      // Validation logic for environment variables
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{ // <-- Implements NestModule
  configure(consumer: MiddlewareConsumer) {
    // Applying AuthMiddleware to all routes ('*')
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
```

-----

## 4\. Running and Verification 🚀

### Running the Application (with `cross-env`)

To run your application, you must set the `NODE_ENV` variable. To ensure **cross-platform compatibility** (e.g., for Windows users), use the **`cross-env`** package in your `package.json` scripts.

If you haven't already, install `cross-env`:

```bash
npm install --save-dev cross-env
```

Your `package.json` scripts should look like this (simplified):

```json
"scripts": {
  "start:dev": "cross-env NODE_ENV=dev nest start --watch",
  "start:prod": "cross-env NODE_ENV=prod node dist/main",
  // ... other scripts
},
```

Use the following command to run in development mode:

```bash
npm run start:dev
```

### Verification

Since the `AuthMiddleware` is applied globally and checks for an `Authorization` header, any unauthenticated request will be blocked.

Upon running `GET /` to `http://localhost:3000/` without an `Authorization` header:

```
response:
{
  "message": "Unauthorized"
}
```

This confirms the middleware is working correctly and intercepting the request before it reaches the main route handler.