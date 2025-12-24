export interface CreateWarehouseReceiveRequest {
  receiveNo: string;
  receiveDate: string; // ISO string เช่น 2025-12-15T03:22:48.515Z
  receiveType: string;
  companyCode: string;
  deliveryNo: string;
  invoiceNo: string;
  invoiceDate: string; // ISO string
  warehouse: string;
  createdBy: string;
  remark?: string;
  rfidlist: WarehouseRFIdItem[];
}

export interface WarehouseRFIdItem {
  rfid: string;
  poNo: string;
  poNoItem: number;
  itemCode: string;
  colorCode: string;
  size: string;
  uom: string;
  sku: string;
  status?: boolean;
}
