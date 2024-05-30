import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
import { Firestore, docData, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Subscription } from 'rxjs';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  public authForm!: FormGroup;
  public isLogin = false;
  public loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private route: Router,
    private auth: Auth,
    private afs: Firestore
  ){}
  ngOnInit(): void {
    this.initAuthForm();
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    })
  }

  loginUser():void{
    const { email, password} = this.authForm.value;
    this.login(email, password).then(()=>{
      console.log("login done");
    }).catch(e=>{
      console.log("login error",e);
      
    })
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user =>{
      const currentUser = { ...user, uid: credential.user.uid}
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
        if(user && user['role'] === ROLE.USER){
          this.route.navigate(['/cabinet']);
        }else if(user && user['role'] === ROLE.ADMIN){
          this.route.navigate(['/admin']);
        }
      this.accountService.isUserLogin$.next(true);

      
    }, (e)=>{
      console.log(e);
      
    })
    

  }

  changeIsLogin():void{
    this.isLogin = !this.isLogin;
  }



  registerUser(): void { 
    const { email, password } = this.authForm.value;
    this.emailSignUp(email, password).then(() => {
     
      this.isLogin = !this.isLogin;
      this.authForm.reset();
    }).catch(e => {
      
    })
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      orders: [],
      role: 'USER'
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }
}
