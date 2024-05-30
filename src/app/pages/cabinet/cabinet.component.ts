import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account/account.service';
import {doc, setDoc, updateDoc} from "@angular/fire/firestore";

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent {

  public editForm!: FormGroup;
  public currentUser: any;
  public isPersonalDataOpen = false;
  public isHistoryOrdersOpen = false;
  public isChangingPasswordOpen = false;
  public buys : any;
  
  constructor(
    public accountService: AccountService,
    private router: Router,
    private fb: FormBuilder,
    private afs: Firestore
    
  ) {}

  ngOnInit(): void {
    this.getPersonalData();
    this.initEditForm();
    this.historyUpdate();
  }

  initEditForm(): void {
    this.editForm = this.fb.group({
      firstName: [this.currentUser?.firstName, Validators.required],
      lastName: [this.currentUser?.lastName, Validators.required],
      phone: [this.currentUser?.phone, Validators.required],
      email: [this.currentUser?.email, Validators.required],
    });
  }


  getPersonalData(): void {
    const currentUserString = localStorage.getItem('currentUser');
    this.currentUser = currentUserString ? JSON.parse(currentUserString) : undefined;
  }

  togglePersonalData(): void {
    this.isPersonalDataOpen = !this.isPersonalDataOpen;
    this.isHistoryOrdersOpen = false;
    this.isChangingPasswordOpen = false;
  }

  toggleHistoryOrders(): void {
    this.isHistoryOrdersOpen = !this.isHistoryOrdersOpen;
    this.isPersonalDataOpen = false;
    this.isChangingPasswordOpen = false;
  }
  toggleChangePassword(): void {
    this.isChangingPasswordOpen = !this.isChangingPasswordOpen;
    this.isHistoryOrdersOpen = false;
    this.isPersonalDataOpen = false;
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
    this.accountService.isUserLogin$.next(true);
  }

  editPersonalData(): void {
    const currentUserDataStr = localStorage.getItem('currentUser');

    if (currentUserDataStr) {
      const currentUserData = JSON.parse(currentUserDataStr);
      Object.assign(currentUserData, this.editForm.value);
      localStorage.setItem('currentUser', JSON.stringify(currentUserData));
      this.accountService.updateUserData(currentUserData.uid, this.editForm.value)
        .then(() => console.log('success'))
        .catch(err => console.error(err));
      this.accountService.isUserLogin$.next(true);
    }
  }

  historyUpdate():void{
    const currentUserDataStr = localStorage.getItem('currentUser');
    if (!currentUserDataStr) {
      return;
    }
    const currentUserData = JSON.parse(currentUserDataStr);

    this.buys = currentUserData.buys
    
    
  }
   async deleteBuy(index: number):Promise<void>{
    const currentUserDataStr = localStorage.getItem('currentUser');
    if (!currentUserDataStr) {
      return;
    }
    const currentUserData = JSON.parse(currentUserDataStr);
    if (currentUserData && Array.isArray(currentUserData.buys)) {
      currentUserData.buys.splice(index, 1); // Видалення покупки за індексом
      localStorage.setItem('currentUser', JSON.stringify(currentUserData));
      const docRef = doc(this.afs, 'users', currentUserData.uid);
      try {
        await updateDoc(docRef, { ...currentUserData });
        console.log('Document successfully updated in Firestore.');
        this.historyUpdate();
      } catch (err) {
        console.error('Error updating document:', err);
      }
   }
}
}