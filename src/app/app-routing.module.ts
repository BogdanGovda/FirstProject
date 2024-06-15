import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './pages/home/home.component';
import { DiscountComponent } from './pages/discount/discount.component';
import { DiscountInfoComponent } from './pages/discount-info/discount-info.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductInfoComponent } from './pages/product-info/product-info.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';


import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductComponent } from './admin/admin-product/admin-product.component';
import { AdminDiscountComponent } from './admin/admin-discount/admin-discount.component';
import { AdminNewsComponent } from './admin/admin-news/admin-news.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';
import { authGuard } from './shared/guards/auth/auth.guard';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { CabinetComponent } from './pages/cabinet/cabinet.component';
import { AuthUserGuard } from './shared/guards/auth/auth-user.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'discount', component: DiscountComponent},
  {path: 'discount/:id', component: DiscountInfoComponent},
  {path: 'product/:category/:id', component: ProductInfoComponent},

  {path: 'product/:category', component: ProductComponent},
  {path: 'delivery', component: DeliveryComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contacts', component: ContactsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'auth', component: AuthorizationComponent},
  {path: 'cabinet', component: CabinetComponent},

  {path: 'admin', component: AdminComponent, canActivate: [authGuard] , children:[
    {path: '', pathMatch: 'full', component: AdminCategoryComponent},
    {path: 'category', component: AdminCategoryComponent},
    {path: 'product', component: AdminProductComponent},
    {path: 'discount', component: AdminDiscountComponent},
    {path: 'news', component: AdminNewsComponent},
    {path: 'order', component: AdminOrderComponent}
  ]}







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
