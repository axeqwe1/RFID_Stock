import type { ProductTransactionResult } from "../../types/productOnlineType";

export class FPSPOEntity {
  private data: ProductTransactionResult[];
  constructor(data: ProductTransactionResult[]) {
    this.data = [...data];
  }

  GetAllProductData() {
    return [...this.data];
  }
}
