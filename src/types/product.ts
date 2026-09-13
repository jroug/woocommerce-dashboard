export type ProductStatus = "publish" | "draft" | "pending" | "private" | "future" | "trash";
export type ProductType = "simple" | "variable" | "grouped" | "external";
export type StockStatus = "instock" | "outofstock" | "onbackorder";
export type InventoryFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
export type PriceFilter = "all" | "under-50" | "50-100" | "over-100";
export type ProductSort =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-high"
  | "price-low"
  | "stock-high"
  | "stock-low";

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}
export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}
export type Backorders = "no" | "notify" | "yes";
export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}
export interface ProductOption {
  id: number;
  name: string;
  values: string[];
}
export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: string;
  stockQuantity: number | null;
  stockStatus: StockStatus;
}
export interface ProductSeo {
  title: string;
  description: string;
}

/** Normalized product fields used by the dashboard. */
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  status: ProductStatus;
  type: ProductType;
  price: string;
  regularPrice: string;
  salePrice: string;
  currency: string;
  stockQuantity: number | null;
  stockStatus: StockStatus;
  manageStock: boolean;
  lowStockThreshold: number;
  category: ProductCategory;
  categories?: ProductCategory[];
  image: ProductImage;
  totalSales: number;
  dateCreated: string;
  datePublished?: string | null;
  dateModified?: string | null;
  tags?: string[];
  brands?: string[];
}

export interface ProductDetails extends Product {
  readOnly?: boolean;
  permalink?: string;
  shortDescription?: string;
  weightUnit?: string;
  dimensionUnit?: string;
  description: string;
  images: ProductImage[];
  cost: string;
  barcode: string;
  backorders: Backorders;
  physicalProduct: boolean;
  weight: string;
  dimensions: ProductDimensions;
  shippingClass: string;
  categories: ProductCategory[];
  tags: string[];
  brand: string;
  productTypeLabel: string;
  options: ProductOption[];
  variants: ProductVariant[];
  seo: ProductSeo;
  revenue: string | null;
  ordersCount: number | null;
}
