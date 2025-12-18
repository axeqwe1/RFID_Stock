export interface RFIDType {
  rfid: string;
  status: boolean;
  sku?: string | null;
}

export interface RFIDPOBody {
  rfid: string;
  POno: string;
  ProductCode: string;
  Color: string;
  Size: string;
  SKU: string;
  Unit: string;
  POItemNo: number;
  Barcode?: string;
  Status?: boolean;
}
