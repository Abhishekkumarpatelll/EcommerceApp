import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/product.model';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CurrencyPipe] // optional, for DI use
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.initForm();
    });
  }

  initForm() {
    const itemForms = this.cartItems.map(item =>
      this.fb.group({
        quantity: [item.quantity, [Validators.required, Validators.min(1)]]
      })
    );
    this.cartForm = this.fb.group({
      items: this.fb.array(itemForms)
    });
  }

  updateCart() {
    const updatedItems = this.cartItems.map((item, index) => ({
      ...item,
      quantity: this.cartForm.value.items?.[index]?.quantity || 1
    }));

    this.cartService.setCartItems(updatedItems); // Ensure you have this method in CartService
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(this.cartItems[index].product.id);
  }

  get total() {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  get itemsFormArray(): FormArray {
    return this.cartForm.get('items') as FormArray;
  }
}
