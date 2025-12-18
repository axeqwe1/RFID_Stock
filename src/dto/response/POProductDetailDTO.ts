export interface POProductDetailDTO {
  itemCode: string;
  itemNo: number | null;
  colorCode: string;
  size: string;
  sku: string;
  productBarcode: string;
  uom: string;
  poQty: number;
  balanceQty: number;
}
