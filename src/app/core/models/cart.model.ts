import { Product, VariantSelection } from "./product.model";
export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: VariantSelection[];
}
