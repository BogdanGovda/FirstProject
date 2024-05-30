import { Component } from '@angular/core';
import { Firestore, collection, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import {doc, setDoc, updateDoc} from "@angular/fire/firestore";

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss']
})
export class AdminOrderComponent {


  public allOrders: any[]=[];
  public allBuys: any[] = [];
  public selectedOrderIndex: any[]=[];
  public users: any[] = [];

  constructor(
    private afs: Firestore
  ) {}

  async ngOnInit(){
    this.innitBuys();
    
  }
 async innitBuys(){
 
  const db = getFirestore();
    const userBuysRef = collection(db, 'users'); 
    const userDocsQuery = query(userBuysRef);
    const userDocsSnapshot = await getDocs(userDocsQuery);

    userDocsSnapshot.docs.forEach(doc => {
      const buys = doc.data()['buys'];
      if (buys && Array.isArray(buys)) {
        this.allBuys.push(...buys);
      }
    });
    console.log(this.allBuys); 
 }




 showOrder(order: any): void {
  this.selectedOrderIndex = order;
 }



 async successOrder(buy: any, id: any) {
  buy.progress = true;
}
async deleteBuy(buyId: string): Promise<void> {
}




}
