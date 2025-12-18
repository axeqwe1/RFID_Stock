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
  rfidScan: number;
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
  status?: boolean;
  createDate: Date;
  ReceiveNo?: string;
  PONo?: string;
  POItemNo?: string;
  UOM?: string;
}

export interface SalesDaily {
  order_date?: string; // ใช้ string แทน DateTime (ISO string เช่น "2025-09-23T00:00:00Z")
  source_name?: string;
  currency?: string; // C# char แปลงมาเป็น string ความยาว 1
  sku?: string;
  title?: string;
  size?: string;
  total_qty?: number;
  gross_sales?: number;
  total_discount?: number;
  net_sales?: number;
  total_taxes?: number;
  distinct_orders?: number;
}

export interface WarehouseStock {
  locationId: number;
  warehouse: string;
  address: string;
  availableStock: number;
}
// export interface ProductRFID {
//   style: string;
//   styleCustomer: string;
//   color: string;
//   size: string;
// }
