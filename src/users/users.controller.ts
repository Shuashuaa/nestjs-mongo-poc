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
    async createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.userService.createUser(createUserDto);
        return { message: 'User created successfully', user: newUser };
    }
    // users/ (GET)
    @Get()
    async getUsers() {
        const users = await this.userService.getUsers();
        // console.log(users);
        return { count: users.length, users};
    }
    // users/:id (GET)
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID format', 400);

        const user = await this.userService.getUserById(id);
        if (!user) throw new HttpException('User not found', 404);

        return { message: 'User retrieved successfully', user};
    }
    // users/:id (PATCH)
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 404);
        
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) throw new HttpException('User not found', 404);
        
        return { message: 'User successfully updated', user: updatedUser };
    }
    // users/:id (DELETE)
    @Delete(':id')
    async deleteUser(@Param('id') id: string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new HttpException('Invalid ID', 404);
        
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) throw new HttpException('User not found', 404);

        return { message: 'User successfully deleted' };
    }
}