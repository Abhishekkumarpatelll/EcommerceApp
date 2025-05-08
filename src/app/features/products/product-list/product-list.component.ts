import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category, CartItem } from '../../../core/models/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = true;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentSortField: string = '';
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      priceMin: [null as number | null],
      priceMax: [null as number | null],
      search: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  applyFilters() {
    const { category, priceMin, priceMax, search } = this.filterForm.value;

    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = !category || product.category.id.toString() === category;
      const matchesMinPrice = !priceMin || product.price >= priceMin;
      const matchesMaxPrice = !priceMax || product.price <= priceMax;
      const matchesSearch = !search || 
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()));

      return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSearch;
    });
  }

  resetFilters() {
    this.filterForm.reset({
      category: '',
      priceMin: null,
      priceMax: null,
      search: ''
    });
    this.filteredProducts = [...this.products];
  }

  onSortChange(event: Event, field: 'price' | 'name') {
    const selectElement = event.target as HTMLSelectElement;
    const direction = selectElement.value as 'asc' | 'desc';
    if (direction) {
      this.sortProducts(field, direction);
    }
  }

  sortProducts(field: 'price' | 'name', direction: 'asc' | 'desc') {
    this.filteredProducts.sort((a, b) => {
      let comparison = 0;
      if (field === 'price') {
        comparison = a.price - b.price;
      } else {
        comparison = a.title.localeCompare(b.title);
      }
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  addToCart(product: Product): void {
    const cartItem: CartItem = { product, quantity: 1 };
    this.cartService.addToCart(cartItem);
  }

  viewProductDetail(productId: number) {
    this.router.navigate([`/products/${productId}`]); // This will navigate to the product detail page
  }

}
