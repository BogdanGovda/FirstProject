import { ICategoryResponse } from "../category/category.interface";

export interface IProductRequest{
    category: ICategoryResponse,
    name: string,
    path: string,
    description: string,
    imagePath: string,

    
    price: number,


    matrix: string,
    display: string,
    memory: string,
    bluetooth: string,
    chargingMethod: string,
    material: string,
    produced: string;
    count: 1
}

export interface IProductResponse extends IProductRequest{
    id: number | string;
}