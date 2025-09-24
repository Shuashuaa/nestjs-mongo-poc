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
    // users/ (GET)
    @Get()
    getUsers(){
        return this.userService.getUsers();
    }
    // users/:id (GET)
    @Get(':id')
    async getUserById(@Param('id') id: string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('User not found', 404);
        const findUser = await this.userService.getUserById(id);
        if (!findUser) throw new HttpException('User not found', 404);
        return findUser;
        // return this.userService.getUserById(id);
    }
    // users/:id (PATCH)
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 404);
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('User not found', 404);
        return updatedUser;
    }
    // users/:id (DELETE)
    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 404);
        const deletedUser = await this.userService.deleteUser(id)
        if (!deletedUser) throw new HttpException('User not found', 404);
        return;
    }
}