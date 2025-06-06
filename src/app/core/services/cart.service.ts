import { Injectable } from '@angular/core';
import { CartItem, Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(cartItem: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.product.id === cartItem.product.id);

    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
    } else {
      currentItems.push(cartItem);
    }

    this.cartItems.next([...currentItems]);
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems.value.filter(
      item => item.product.id !== productId
    );
    this.cartItems.next(updatedItems);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  updateCart(updatedItems: CartItem[]): void {
    this.cartItems.next([...updatedItems]);
  }

  setCartItems(items: CartItem[]): void {
    this.cartItems.next([...items]);
  }
}
