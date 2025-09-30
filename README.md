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
<br>

# NestJS RESTful API with MongoDB 🚀

This project is a comprehensive demonstration of building a **RESTful API** using **NestJS** and **MongoDB**. It showcases a complete **CRUD** (Create, Read, Update, Delete) implementation for a `users` resource, leveraging **Mongoose** for seamless database interactions and `class-validator` for data validation.

-----

## ✨ Features

  * **CRUD Operations**: Full **C**reate, **R**ead, **U**pdate, and **D**elete functionality for a `users` resource, following RESTful principles.
  * **Mongoose Integration**: Utilizes the official `@nestjs/mongoose` module for robust object data modeling with MongoDB.
  * **Environment Validation Pipeline**: A custom pipeline that validates environment variables (`.env`) at startup, ensuring all required configurations, like `MONGODB_URI`, are correctly formatted and present.
  * **Middleware**: Implements middleware for tasks like request logging or authorization.
  * **Nest CLI**: Built from the ground up using the NestJS Command Line Interface, streamlining development and boilerplate code generation.

<hr>

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
  * **Node.js**: The runtime environment.
  * **npm**: The Node.js package manager.
  * **MongoDB Community Server**: The database.
  * **MongoDB Compass**: A user-friendly graphical interface (GUI) for MongoDB.

You can download MongoDB components from the official website: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).

-----

## ⚙️ Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1\. Install NestJS CLI

If not already installed, use npm to install the **NestJS Command Line Interface (CLI)** globally. The CLI simplifies project generation and management.

```bash
npm i -g @nestjs/cli
```

### 2\. Create the Project

Use the NestJS CLI to create a new project. You can replace `project-name` with your desired name.

```bash
nest new project-name
```

### 3\. Install Dependencies

Navigate into your new project directory and install the necessary packages for database connectivity and validation.

```bash
cd project-name
npm i @nestjs/mongoose mongoose class-validator class-transformer
```

  \* `@nestjs/mongoose`: The official NestJS module for integrating Mongoose.
  \* `mongoose`: The core Mongoose library for MongoDB.
  \* `class-validator` & `class-transformer`: These libraries enable powerful validation and transformation of data, which is crucial for DTOs.

-----

## 📦 Database Connection

This project connects to a local MongoDB instance.

### 1\. Start MongoDB Server

Launch **MongoDB Community Server** and **MongoDB Compass**. Use Compass to create a new database to store your data.

  \* Open MongoDB Compass and connect to your local server (the default URL is `mongodb://localhost:27017`).
  \* Create a new database and name it **`my_first_mongodb`**.

### 2\. Configure the Connection

Open your `src/app.module.ts` file and configure the database connection by adding `MongooseModule.forRoot()` to the `imports` array.

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

This project provides a complete **CRUD** implementation for a user resource. Here are the key files and their roles.

### `src/users/dto/CreateUser.dto.ts`

This **Data Transfer Object (DTO)** defines the shape and validation rules for creating a user. The `class-validator` decorators ensure data integrity.

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

### `src/users/dto/UpdateUser.dto.ts`

This DTO is used for updating a user. By making both fields optional, you can update a single field without providing the other.

```typescript
import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    displayName?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
```

### `src/users/users.controller.ts`

This controller handles all incoming HTTP requests for the `/users` resource. It uses decorators like `@Get()`, `@Post()`, `@Patch()`, and `@Delete()` to define the API endpoints. It also includes validation and error handling for invalid user IDs.

```typescript
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    UsePipes, 
    ValidationPipe, 
    Param, 
    HttpException, 
    Patch, 
    Delete,
    HttpStatus
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/CreateUser.dto";
import mongoose from "mongoose";
import { UpdateUserDto } from "./dto/UpdateUser.dto";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.userService.createUser(createUserDto);
        return { message: 'User created successfully', user: newUser };
    }

    @Get()
    async getUsers() {
        const users = await this.userService.getUsers();
        return { count: users.length, users};
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return { message: 'User retrieved successfully', user};
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        
        return { message: 'User successfully updated', user: updatedUser };
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return { message: 'User successfully deleted' };
    }
}
```

### `src/users/users.service.ts`

This service contains all the business logic for user management. It interacts with the database using the injected Mongoose `userModel`.

```typescript
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/User.schema";
import { CreateUserDto } from "./dto/CreateUser.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    
    createUser(createUserDto: CreateUserDto) {
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    getUsers(){
        return this.userModel.find();
    }

    getUserById(id: string){
        return this.userModel.findById(id);
    }

    updateUser(id: string, UpdateUserDto: UpdateUserDto){
        return this.userModel.findByIdAndUpdate(id, UpdateUserDto, { new: true});
    }

    deleteUser(id: string){
        return this.userModel.findByIdAndDelete(id);
    }
}
```

-----

## 🏃 Running the Project

To run the application, use the following command in your terminal:

```bash
npm run start:dev
```

This will start the development server, which automatically reloads on file changes.

-----

## 💻 API Endpoints

You can test the following API endpoints using a tool like **Postman**, **Insomnia**, or a REST client browser extension.

I can definitely fix that for you. The code blocks for the JSON bodies were not formatted correctly. Here's the corrected and properly formatted section for the `README.md` file.

<br>

-----

### 💻 API Endpoints

You can test the following API endpoints using a tool like **Postman**, **Insomnia**, or a REST client browser extension.

### Create a User (`POST`)

  * **URL**: `http://localhost:3000/users`

  * **Method**: `POST`

  * **Body**: `JSON` with `username` (required) and `displayName` (optional).

    ```json
    {
        "username": "joshua",
        "displayName": "Juswa"
    }
    ```

  * **Response (Success)**: `201 Created` with the new user's data.

### Get All Users (`GET`)

  * **URL**: `http://localhost:3000/users`
  * **Method**: `GET`
  * **Response (Success)**: `200 OK` with a list of all users.

### Get User by ID (`GET`)

  * **URL**: `http://localhost:3000/users/your-user-id`
  * **Method**: `GET`
  * **Response (Success)**: `200 OK` with the user's data.
  * **Response (Error)**: `404 Not Found` if the user doesn't exist.

### Update a User (`PATCH`)

  * **URL**: `http://localhost:3000/users/your-user-id`

  * **Method**: `PATCH`

  * **Body**: `JSON` with the fields you want to update.

    ```json
    {
        "displayName": "New Display Name"
    }
    ```

  * **Response (Success)**: `200 OK` with the updated user's data.

  * **Response (Error)**: `404 Not Found` if the user doesn't exist.

### Delete a User (`DELETE`)

  * **URL**: `http://localhost:3000/users/your-user-id`
  * **Method**: `DELETE`
  * **Response (Success)**: `200 OK` with a confirmation message.
  * **Response (Error)**: `404 Not Found` if the user doesn't exist.

### Environment Config

[ENVMNGMNT.md](https://www.google.com/search?q=ENVMNGMNT.md)