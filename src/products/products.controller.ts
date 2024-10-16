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
import { UpdateProductDto } from "./dto/UpdateProduct.dto";
import mongoose from "mongoose";

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
