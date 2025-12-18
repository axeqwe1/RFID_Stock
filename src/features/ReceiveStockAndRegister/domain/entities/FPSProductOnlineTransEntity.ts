import type {
  ProductOnline,
  ProductTransactionResult,
} from "../../types/productOnlineType";

export class FPSProductOnlineTransEntity {
  private data: ProductTransactionResult[];
  constructor(data: ProductTransactionResult[]) {
    this.data = [...data];
  }

  GetAll() {
    return [...this.data];
  }
}
