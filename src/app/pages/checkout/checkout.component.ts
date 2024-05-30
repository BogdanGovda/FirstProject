import { Component, Input } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { OrderService } from 'src/app/shared/services/order/order.service';
import {doc, setDoc, updateDoc} from "@angular/fire/firestore";
import { HeaderComponent } from 'src/app/components/header/header.component';
import { BasketUpdateService } from 'src/app/shared/services/basket/basket-update.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  @Input() currentUserData: any;

  public orderForm !: FormGroup;
  public currentUser: any;
  public totalOrder: any;
  public totalItems: any;
  public orderList: any;



  
  constructor(
    public accountService: AccountService,
    private orderService: OrderService,
    private fb:FormBuilder,
    private afs: Firestore,
    private headerComponent: HeaderComponent,
   
    
  ){  
  }
  ngOnInit(): void {
    this.getPersonalData();
    this.innitOrderForm();
    this.innitOrder();
   
    
    
  }

  innitOrder(): void{
    const currentUserDataStr = localStorage.getItem('currentUser');
    if (!currentUserDataStr) {
      return;
    }
    
    if (currentUserDataStr) {
      const currentUserData = JSON.parse(currentUserDataStr);
      if (currentUserData) {
        this.totalOrder = currentUserData.orders;
        this.totalItems =  currentUserData.orders.items;
      }
    }
    
    
  }
  async show():Promise<void>{

    const countryValue = this.orderForm.value;
    const currentUserDataStr = localStorage.getItem('currentUser');
    if (!currentUserDataStr) {
      return;
    }
    const currentUserData = JSON.parse(currentUserDataStr);
  const buy = {
    country: countryValue.country,
    first_name: countryValue.first_name,
    last_name: countryValue.last_name,
    address: countryValue.address,
    city: countryValue.city,
    phone_number: countryValue.phone_number,
    order: this.totalItems,
    totalPrice: currentUserData.orders.totalPrice,
    progress: false,
    id:currentUserData.uid
    
    
  };
  if (currentUserData) {
    
    if (!Array.isArray(currentUserData.buys)) {
      currentUserData.buys = []; 
    }
    currentUserData.buys.push(buy); 
    localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    const docRef = doc(this.afs, 'users', currentUserData.uid);
    try {
      await updateDoc(docRef, { ...currentUserData }); 
      console.log('Document successfully updated in Firestore.');
      
    } catch (err) {
      console.error('Error updating document:', err);
    }
  
    this.accountService.isUserLogin$.next(true);
  }
    this.headerComponent.deleteAllProductFromBasket();
   this.headerComponent.updateBasket();
   location.reload();
   
    
  
  }

  innitOrderForm(): void{
    this.orderForm = this.fb.group({
      country: [null, Validators.required],
      first_name: [this.currentUser?.firstName, Validators.required],
      last_name: [this.currentUser?.lastName, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      phone_number: [this.currentUser?.phone, Validators.required]
    })
  }

  getPersonalData(): void {
    const currentUserString = localStorage.getItem('currentUser');
    this.currentUser = currentUserString ? JSON.parse(currentUserString) : undefined;
  }
 
}
