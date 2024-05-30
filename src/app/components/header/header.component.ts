import { Component } from '@angular/core';
import { AdminProductComponent } from 'src/app/admin/admin-product/admin-product.component';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { ICategoryResponse } from 'src/app/shared/interface/category/category.interface';
import { IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { OrderService } from 'src/app/shared/services/order/order.service';
import {createUserWithEmailAndPassword} from "@angular/fire/auth";
import {Firestore, doc, setDoc, updateDoc} from "@angular/fire/firestore";
import { BasketUpdateService } from 'src/app/shared/services/basket/basket-update.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public total = 0;
  public basket: Array<IProductResponse> = [];
  public isLogin = false;
  public loginUrl = '';
  public loginPage = '';
  

  



  public isBasketOpen = false;


  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private afs: Firestore,
    
    


  ) { }

  ngOnInit(): void {
    this.loadBasket();
   
    this.updateBasket();
    this.checkUserLogin();
    this.checkUpdatesUserLogin();

  }

  openBasketModal(): void {
    this.isBasketOpen = !this.isBasketOpen;
  }


  countOfProduct(basketProduct: IProductResponse, value: boolean): void {
    if (value) {
      ++basketProduct.count;
      this.getTotalPrice();
    } else if (!value && basketProduct.count > 1) {
      --basketProduct.count;
      this.getTotalPrice();
    }
  }

  deleteProductFromBasket(productBasketIndex: number): void {
    this.basket.splice(productBasketIndex, 1);
    this.updateBasket();
    this.getTotalPrice();
    let storedBasket = JSON.parse(localStorage.getItem('basket') || '[]');
    storedBasket.splice(productBasketIndex, 1);
    localStorage.setItem('basket', JSON.stringify(storedBasket));
  }

  deleteAllProductFromBasket(): void {
   
    this.basket = [];
    this.updateBasket();
    this.getTotalPrice();
    localStorage.removeItem('basket');
  
  }

  loadBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
  }

  getTotalPrice(): void {
    this.total = this.basket.reduce((total: number, prod: IProductResponse) => total + prod.price * prod.count, 0)
  }

  updateBasket(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    })
  }

  
  async placeAnOrder(): Promise<void> {  
    const currentUserDataStr = localStorage.getItem('currentUser');
    if (!currentUserDataStr) {
      
      return;
    }
  
    const currentUserData = JSON.parse(currentUserDataStr);
    const order = {
      items: this.basket.map(product => ({
        name: product.name,
        imagePath: product.imagePath,
        productId: product.id,
        quantity: product.count,
        price: product.price
      })),
      totalPrice: this.total,
    };
  
    this.orderService.addOrder(order);
  
    if (currentUserData) {
      currentUserData.orders = order; 
      localStorage.setItem('currentUser', JSON.stringify(currentUserData));
      const docRef = doc(this.afs, 'users', currentUserData.uid);
      try {
        await updateDoc(docRef, { orders: currentUserData.orders });
        console.log('Document successfully updated in Firestore.');
      } catch (err) {
        console.error('Error updating document:', err);
      }
    
      this.accountService.isUserLogin$.next(true);
    }
  
    
  }
  


  checkUserLogin(): void{
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    if(currentUser && currentUser.role === ROLE.ADMIN){
      this.isLogin = true;
      this.loginUrl = "admin";
      this.loginPage = "Адмін";
    } else if(currentUser && currentUser.role === ROLE.USER){
      this.isLogin = true;
      this.loginUrl = "cabinet";
      this.loginPage = "Кабінет";
    }else{
      this.isLogin = false;
      this.loginUrl = "";
      this.loginPage = "";
    }
  }

  checkUpdatesUserLogin(): void{
    this.accountService.isUserLogin$.subscribe(()=>{
      this.checkUserLogin();
    })
  }
}
