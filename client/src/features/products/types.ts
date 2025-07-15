export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Subcategory = {
  id: number;
  name: string;
  description: string;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  cost: number;
  size: string;
  unit: string;
  category: Category;
  subcategory: Subcategory;
};
