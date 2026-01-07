export interface ScanOutStockRequest {
  requestOutNo: string;
  outType: string;
  outDate: Date;
  productCode: string;
  color: string;
  size: string;
  outQty: number;
}

export interface RequestOutHeader {
  requestNo: string; // auto / generate
  requestDate: Date;
  outType: string; // from Warehouse_InoutType
  requestBy: string; // user login
  outsourcePONo?: string; // optional (POType = 3)
}

export interface RequestOutItem {
  productCode: string;
  color?: string;
  size?: string;
  qty: number;
  uom: string;
}

export interface OutstockRequest {
  header: RequestOutHeader;
  items: RequestOutItem[];
}

export interface WarehouseOutstock {
  warehouse: string;
  rfid: string;
  productBarcode: string;
  sku: string;
  productCode: string;
  color: string;
  size: string;
  uom: string;
  status: boolean;
  outNo: string;
  outDate: Date;
  outType: string;
  outBy: string;
  inputOutDate: Date;
  receiveDate: Date;
  receiveNo: string;
  inputBy: string;
  inputDate: Date;
}

export interface RequestListOutStock {
  requestNo: string;
  requestDate: Date;
  outType: string;
  requestBy: string;
  productBarcode: string;
  sku: string;
  productCode: string;
  color: string;
  size: string;
  qty: number;
  uom: string;
}
