import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProductResponse } from '../../interface/product/product.interface';
import {environment} from "../../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {Firestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public changeBasket = new Subject<boolean>();

  private url = environment.BACKEND_URL;
  private api = { auth: `${this.url}/auth` };

  public orders: any[] = [];

  constructor(
    private http: HttpClient,
    private fireStore: Firestore

  ) { }

  addOrder(order: any): void {
    this.orders.push(order);
  }



}
