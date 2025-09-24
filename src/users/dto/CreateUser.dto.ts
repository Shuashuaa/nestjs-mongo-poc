import { IsNotEmpty, IsOptional, IsString } from "class-validator";

// Defines how incoming HTTP request data should look
export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsString()
    @IsOptional()
    displayName?: string;
}