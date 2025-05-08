export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  variants?: ProductVariant[];
  creationAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  type: string;
  values: string[];
}

export interface Category {
  id: number;
  name: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: VariantSelection[];
}

export interface VariantSelection {
  type: string;
  value: string;
}



