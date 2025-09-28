
-----

## Environment Variable Management with `@nestjs/config` ⚙️

NestJS provides the **`@nestjs/config`** package, a powerful tool for handling environment variables. It can dynamically load different `.env` files based on the environment you're running your application in (e.g., development, production). This is crucial for managing database connection strings, API keys, and other sensitive information without hardcoding them.

### Installation

First, install the `@nestjs/config` package using npm:

```bash
npm install @nestjs/config
```

-----

## 1\. Project Structure 📁

Organize your `.env` files in the root of your project directory, using a naming convention that distinguishes between environments.

```
project-root/
  .env.dev
  .env.prod
  src/
    app.module.ts
```

  * **`.env.dev`**: Contains variables for your development environment.
  * **`.env.prod`**: Contains variables for your production environment.

-----

## 2\. Configure `ConfigModule` in `app.module.ts` 📝

To enable the dynamic loading of `.env` files, configure the `ConfigModule` in your root module. Setting `isGlobal: true` makes the `ConfigModule` available throughout your application without needing to be imported into every other module.

The `envFilePath` option is an array that tells NestJS which file to load. We use a template literal and `process.env.NODE_ENV` to dynamically select the correct `.env` file, ensuring the application uses the right configuration for the given environment.

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`], // <-- dynamically selects the file
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
export class AppModule {}
```

The `MongooseModule.forRootAsync` method is used here to ensure the database connection is established only after the `ConfigModule` has loaded the environment variables.

-----

## 3\. Example `.env` Files 📁

Here are examples of how your environment files would look. Each file contains the same variable name (`MONGODB_URI`) but with a different value tailored for its specific environment.

**`.env.dev`**

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/dev_db
```

**`.env.prod`**

```bash
MONGODB_URI=mongodb://mongo.prod.server:27017/prod_db
```

-----

## 4\. Running the Application 🚀

To run your application with the correct environment variables, you'll use specific npm scripts.

### For Development (with live-reloading)

Run this command to start the application in development mode.

```bash
npm run start:dev
```

This command will use your `package.json` script to set `NODE_ENV` to `dev`, automatically loading the `.env.dev` file and enabling live-reloading.

### For Production

Run this command to build and start your application in production mode.

```bash
npm run start:prod
```

This command will set `NODE_ENV` to `prod`, ensuring the `.env.prod` file is loaded and the application runs in an optimized production environment.

### Cross-Platform Compatibility 💻

If you're using Windows, you may encounter an error because the syntax for setting environment variables is different. To fix this, install the **`cross-env`** package as a development dependency.

```bash
npm install --save-dev cross-env
```

After installation, update your `package.json` scripts to use `cross-env` to ensure your commands work on all operating systems.

```json
"scripts": {
  "start:dev": "cross-env NODE_ENV=dev nest start --watch",
  "start:prod": "cross-env NODE_ENV=prod node dist/main",
  // ... other scripts
},
```

Now, the `npm run start:dev` and `npm run start:prod` commands will work for all developers, regardless of their operating system. This is a crucial step for ensuring consistency and portability in team-based projects.