import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "src/schemas/Product.schema";
import { CreateProductDto } from "./dto/CreateProduct.dto";
import { UpdateProductDto } from "./dto/UpdateProduct.dto";

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

    updateProduct(id: string, updateProductDto: UpdateProductDto){
        return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true});
    }

    deleteProduct(id: string){
        return this.productModel.findByIdAndDelete(id);
    }
}
