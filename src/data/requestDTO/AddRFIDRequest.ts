export interface AddRfidRequest {
  Barcode: string;
  Style: string;
  Color: string;
  Size: string;
  targetQty: number;
  EPC: string;
}
