import { Component } from '@angular/core';
import { Firestore, collection, getDoc, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
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



 async successOrder(buyId: any, userId: any) {
  const db = getFirestore();
  const userDocRef = doc(db, 'users', userId);
  try {
    const userDocInfo = await getDoc(userDocRef);
    
    if (userDocInfo.exists()) {
      const userData = userDocInfo.data();
      const buys = userData['buys'];
      
      const buyIndex = buys.findIndex(((buys: { id: any; }) => buys.id === buyId));
      
      if (buyIndex !== -1) {
        buys[buyIndex].progress = true;
        await updateDoc(userDocRef, { buys });
      }
    }
  } catch (e) {
    console.log("eror", e);
  }
    
}

async deleteBuy(buyId: string): Promise<void> {
}




}
