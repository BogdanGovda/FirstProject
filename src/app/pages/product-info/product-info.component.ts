import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent {


  
  public product!: IProductResponse;

constructor(
  private productService: ProductService,
  private activatedRoute: ActivatedRoute,
  private orderService: OrderService
  ){}

ngOnInit(): void {
  this.getOneProduct();

}

getOneProduct():void{
  const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
  this.productService.getOneFirebase(id as unknown as string).subscribe(data =>{
    if (data) {
      this.product = data as IProductResponse;
    }

  });


}

addToBasket(product: IProductResponse): void {
  let basket: Array<IProductResponse> = [];
  if(localStorage.length > 0 && localStorage.getItem('basket')){
    basket = JSON.parse(localStorage.getItem('basket') as string);
    if(basket.some(prod => prod.id === product.id)){
      const index = basket.findIndex(prod => prod.id === product.id);
      basket[index].count += product.count;
    } else {
      basket.push(product);
    }
  } else {
    basket.push(product);
  }
  localStorage.setItem('basket', JSON.stringify(basket));
  product.count = 1;
  this.orderService.changeBasket.next(true);
}


countOfProduct(product: IProductResponse, value: boolean): void {
  if (value) {
    ++product.count;
  } else if (!value && product.count > 1) {
    --product.count;
  }
}
}
