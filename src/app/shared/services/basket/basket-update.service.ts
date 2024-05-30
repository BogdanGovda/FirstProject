import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProductResponse } from '../../interface/product/product.interface';

@Injectable({
  providedIn: 'root'
})
export class BasketUpdateService {

  private updateSubject = new Subject<void>();

  public basket: Array<IProductResponse> = [];
  orderService: any;

 
    

 
}
