export interface ProductInfo {
  name: string;
  price: number;
}

export enum ProductCategory {
  DISCOUNT = 'OPUST',
}

export enum ProductName {
  DISCOUNT = 'DISCOUNT',
  ERROR = 'NOT_FOUND',
}

export enum ProductPrice {
  ERROR = 0,
}
