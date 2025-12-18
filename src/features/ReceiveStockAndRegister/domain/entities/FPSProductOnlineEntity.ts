import type { ProductTransactionResult } from "../../types/productOnlineType";

export class FPSProductOnlineEntity {
  private data: ProductTransactionResult[];
  constructor(data: ProductTransactionResult[]) {
    this.data = [...data];
  }

  GetAllProductData() {
    return [...this.data];
  }
}
