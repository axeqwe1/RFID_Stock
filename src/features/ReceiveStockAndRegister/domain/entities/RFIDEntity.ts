import type { ProductRFID } from "@/types/type";

export class RFIDEntity {
  private ProductRFID: ProductRFID[];
  constructor(ProductRFID: ProductRFID[]) {
    this.ProductRFID = [...ProductRFID];
  }

  GetAllRFID() {
    return [...this.ProductRFID];
  }

  GetRFIDBySKU(SKU: string) {
    if (!SKU?.trim()) return [];
    return this.ProductRFID.filter((item) => item.sku === SKU);
  }

  // เพิ่ม business logic
  GetActiveProducts() {
    return this.ProductRFID.filter((item) => item.status);
  }
}
