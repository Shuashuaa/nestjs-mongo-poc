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
    Delete
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/CreateUser.dto";
import mongoose from "mongoose";
import { UpdateUserDto } from "./dto/UpdateUser.dto";

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}
    
    // users/ (POST)
    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto)
        return this.userService.createUser(createUserDto)
    }
}