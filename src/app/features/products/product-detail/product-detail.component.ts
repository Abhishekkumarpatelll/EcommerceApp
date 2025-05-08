import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductVariant, VariantSelection } from '../../../core/models/product.model';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  productForm!: FormGroup;
  selectedImage = '';
  selectedVariantValues: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private cartService: CartService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.selectedImage = product.images[0];
          this.initForm();
        },
        error: (err) => {
          console.error('Error loading product:', err);
        }
      });
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      variants: this.fb.array([])
    });

    if (this.product.variants) {
      this.product.variants.forEach(variant => {
        const variantGroup = this.fb.group({
          type: [variant.type],
          value: [variant.values[0], Validators.required]
        });
        (this.productForm.get('variants') as FormArray).push(variantGroup);

        // Initialize selected values
        this.selectedVariantValues[variant.type] = variant.values[0];
      });
    }
  }

  get variantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  // Update the onVariantChange method
  onVariantChange(type: string, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedVariantValues[type] = selectElement.value;
  }

  addToCart() {
    if (this.productForm.valid) {
      const selectedVariants: VariantSelection[] = [];

      if (this.product.variants) {
        this.product.variants.forEach(variant => {
          selectedVariants.push({
            type: variant.type,
            value: this.selectedVariantValues[variant.type]
          });
        });
      }

      this.cartService.addToCart({
        product: this.product,
        quantity: this.productForm.value.quantity,
        selectedVariants: selectedVariants.length > 0 ? selectedVariants : undefined
      });
      
    }
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }
}