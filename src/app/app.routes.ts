import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { ProductVariationComponent } from './components/product-variation/product-variation.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    {
        path: 'menu',
        component: MenuComponent,
        children: [
          { path: 'category', component: CategoryComponent },
          { path: 'product', component: ProductComponent },
          { path: 'product-variation', component: ProductVariationComponent },
        ]
      }

];
