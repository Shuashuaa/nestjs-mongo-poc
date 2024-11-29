# NestJS RESTful API with MongoDB - Products Module 🚀

This project demonstrates building a **RESTful API** using **NestJS** and **MongoDB** with a focus on **products** resource management. It showcases complete **CRUD** (Create, Read, Update, Delete) implementation for a `products` resource, leveraging **Mongoose** for database interactions and `class-validator` for data validation.

-----

## ✨ Features

  * **CRUD Operations**: Full **C**reate, **R**ead, **U**pdate, and **D**elete functionality for a `products` resource, following RESTful principles.
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
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/my_first_mongodb') // Your database connection URL
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

-----

## ✍️ CRUD Operations

This project provides a complete **CRUD** implementation for a product resource. Here are the key files and their roles.

### `src/products/dto/CreateProduct.dto.ts`

This **Data Transfer Object (DTO)** defines the shape and validation rules for creating a product. The `class-validator` decorators ensure data integrity.

```typescript
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsOptional()
    category?: string;
}
```

### `src/products/dto/UpdateProduct.dto.ts`

This DTO is used for updating a product. By making all fields optional, you can update individual fields without providing the others.

```typescript
import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}
```

### `src/products/products.controller.ts`

This controller handles all incoming HTTP requests for the `/products` resource. It uses decorators like `@Get()`, `@Post()`, `@Patch()`, and `@Delete()` to define the API endpoints. It also includes validation and error handling for invalid product IDs.

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
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/CreateProduct.dto";
import mongoose from "mongoose";
import { UpdateProductDto } from "./dto/UpdateProduct.dto";

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async createProduct(@Body() createProductDto: CreateProductDto) {
        const newProduct = await this.productService.createProduct(createProductDto);
        return { message: 'Product created successfully', product: newProduct };
    }

    @Get()
    async getProducts() {
        const products = await this.productService.getProducts();
        return { count: products.length, products};
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }

        const product = await this.productService.getProductById(id);
        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        return { message: 'Product retrieved successfully', product};
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateProductById(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        
        const updatedProduct = await this.productService.updateProduct(id, updateProductDto);
        if (!updatedProduct) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
        
        return { message: 'Product successfully updated', product: updatedProduct };
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
        }
        
        const deletedProduct = await this.productService.deleteProduct(id);
        if (!deletedProduct) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        return { message: 'Product successfully deleted' };
    }
}
```

### `src/products/products.service.ts`

This service contains all the business logic for product management. It interacts with the database using the injected Mongoose `productModel`.

```typescript
import { UpdateProductDto } from './dto/UpdateProduct.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "src/schemas/Product.schema";
import { CreateProductDto } from "./dto/CreateProduct.dto";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}
    
    createProduct(createProductDto: CreateProductDto) {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    getProducts(){
        return this.productModel.find();
    }

    getProductById(id: string){
        return this.productModel.findById(id);
    }

    updateProduct(id: string, UpdateProductDto: UpdateProductDto){
        return this.productModel.findByIdAndUpdate(id, UpdateProductDto, { new: true});
    }

    deleteProduct(id: string){
        return this.productModel.findByIdAndDelete(id);
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

### Create a Product (`POST`)

  * **URL**: `http://localhost:3000/products`

  * **Method**: `POST`

  * **Body**: `JSON` with `name` and `price` (required), `description` and `category` (optional).

    ```json
    {
        "name": "Laptop",
        "description": "High-performance laptop",
        "price": 999.99,
        "category": "Electronics"
    }
    ```

  * **Response (Success)**: `201 Created` with the new product's data.

### Get All Products (`GET`)

  * **URL**: `http://localhost:3000/products`
  * **Method**: `GET`
  * **Response (Success)**: `200 OK` with a list of all products.

### Get Product by ID (`GET`)

  * **URL**: `http://localhost:3000/products/your-product-id`
  * **Method**: `GET`
  * **Response (Success)**: `200 OK` with the product's data.
  * **Response (Error)**: `404 Not Found` if the product doesn't exist.

### Update a Product (`PATCH`)

  * **URL**: `http://localhost:3000/products/your-product-id`

  * **Method**: `PATCH`

  * **Body**: `JSON` with the fields you want to update.

    ```json
    {
        "price": 899.99,
        "description": "Updated description"
    }
    ```

  * **Response (Success)**: `200 OK` with the updated product's data.

  * **Response (Error)**: `404 Not Found` if the product doesn't exist.

### Delete a Product (`DELETE`)

  * **URL**: `http://localhost:3000/products/your-product-id`
  * **Method**: `DELETE`
  * **Response (Success)**: `200 OK` with a confirmation message.
  * **Response (Error)**: `404 Not Found` if the product doesn't exist.
