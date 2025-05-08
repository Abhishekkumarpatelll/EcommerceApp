import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent) 
  },
  { 
    path: 'products/:id', 
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) 
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./features/cart/cart/cart.component').then(m => m.CartComponent) 

  },
  { 
    path: 'checkout', 
    loadComponent: () => import('./features/cart/checkout/checkout.component').then(m => m.CheckoutComponent),
    
    
    canActivate: [AuthGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { path: '**', redirectTo: '' }
];