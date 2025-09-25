<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NestJS Project with MongoDB 🚀

This project is a simple demonstration of connecting a NestJS application to a MongoDB database. It uses **Mongoose**, an object data modeling (ODM) library for Node.js, to handle the database interactions and includes a basic **CRUD** (Create, Read, Update, Delete) implementation.

-----

## 🛠️ Prerequisites

Before you begin, make sure you have the following tools installed on your machine.

  * **Node.js**: The runtime environment for JavaScript.
  * **npm**: The Node.js package manager.
  * **MongoDB Community Server & MongoDB Compass**: The database and its graphical user interface (GUI).
  * You can download them from the official MongoDB website: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

-----

## ⚙️ Setup and Installation

Follow these steps to set up and run the project locally.

### 1\. Install NestJS CLI

If you haven't already, install the **NestJS Command Line Interface (CLI)** globally. The CLI helps you generate project files and manage your application.

```bash
npm i -g @nestjs/cli
```

### 2\. Create the Project

Create a new NestJS project using the CLI. Replace `project-name` with your desired project name.

```bash
nest new project-name
```

### 3\. Install Dependencies

Navigate into your new project directory and install the necessary packages for database connectivity and validation.

```bash
cd project-name
npm i @nestjs/mongoose mongoose class-validator class-transformer
```

  * `@nestjs/mongoose`: The official NestJS module for integrating Mongoose.
  * `mongoose`: The core Mongoose library.
  * `class-validator` & `class-transformer`: These libraries are essential for data validation and transformation, a common practice in NestJS applications.

-----

## 📦 Database Connection

This project uses a local MongoDB instance. If you don't have one running, follow these steps:

### 1\. Start MongoDB Server

Launch the **MongoDB Community Server** and **MongoDB Compass**. Use Compass to create a new database.

  * Open MongoDB Compass.
  * Connect to your local server (usually `mongodb://localhost:27017`).
  * Create a new database named **`my_first_mongodb`**.

### 2\. Configure the Connection

Once the database is created, you need to configure your NestJS application to connect to it.

Open `src/app.module.ts` and add `MongooseModule.forRoot()` to the `imports` array. This line establishes the connection to your MongoDB database.

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/my_first_mongodb') // Your database connection URL
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

-----

## ✍️ CRUD Operations

This project includes a basic implementation of a **create** operation for users. Here is the code structure for the user module.

### `src/users/dto/CreateUser.dto.ts`

This **Data Transfer Object (DTO)** defines the shape and validation rules for the data expected in the request body when creating a new user. The **`class-validator`** decorators handle this. `@IsNotEmpty()` ensures the `username` field is not empty, and `@IsOptional()` allows the `displayName` field to be omitted.

```typescript
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    displayName?: string;
}
```

### `src/users/users.controller.ts`

This controller handles incoming HTTP requests and delegates them to the `UsersService`. The `@Post()` decorator handles `POST` requests, and `@UsePipes(new ValidationPipe())` ensures that the incoming data is validated using the `CreateUserDto` class.

```typescript
import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/CreateUser.dto";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post()
    @UsePipes(new ValidationPipe())

    createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto)
        return this.userService.createUser(createUserDto)
    }
}
```

### `src/users/users.service.ts`

This service contains the business logic for creating a new user. `InjectModel(User.name)` injects the Mongoose model, allowing the service to interact with the `users` collection in the database.

```typescript
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/User.schema";
import { CreateUserDto } from "./dto/CreateUser.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    createUser(createUserDto: CreateUserDto) {
        // create a new user instance/document
        const newUser = new this.userModel(createUserDto)
        return newUser.save();
    }
}
```

### How to use it?

You can test this endpoint using a tool like Postman or a browser extension.

  * **URL**: `http://localhost:3000/users`
  * **Method**: `POST`
  * **Body**: `JSON` with the required user data. The `username` is required, while `displayName` is optional.

Example JSON body:

```json
{
  "username": "joshua"
}
```

### Response on success

Upon successful creation of a user, the API will return a `201 Created` status code and a JSON response similar to the following. The `_id` and `__v` fields are automatically generated by MongoDB and Mongoose.

```json
{
    "username": "joshua",
    "_id": "68d35c36f7f53b100b2aa5f5",
    "__v": 0
}
```