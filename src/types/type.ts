export interface MenuItem {
  label: string;
  icon?: string;
  badge?: number;
  items?: MenuItem[]; // recursive type
  active?: boolean;
}

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
  rating: number;
}
