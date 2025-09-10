export interface MenuItem {
  label: string;
  icon?: string;
  badge?: number;
  items?: MenuItem[]; // recursive type
  active?: boolean;
}

// export interface Product {
//   id: number;
//   code: string;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
//   category: string;
//   quantity: number;
//   inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
//   rating: number;
// }

export interface Product {
  sku: string;
  style: string;
  color: string;
  size: string;
  customerStyle: string;
  price: number;
  barcode: string;
  shopify_InventoryQty: number;
}

export interface ProductDetail {
  sku: string;
  style: string;
  color: string;
  size: string;
  customerStyle: string;
  price: number;
  barcode: string;
  shopify_InventoryQty: number;
  rfid: string;
  qty: number;
}

export interface ProductRFID {
  sku: string;
  rfid: string;
  createDate: Date;
}
// export interface ProductRFID {
//   style: string;
//   styleCustomer: string;
//   color: string;
//   size: string;
// }
