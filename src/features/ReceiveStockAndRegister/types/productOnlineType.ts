export interface ProductOnline {
  companyCode: string;
  itemCode: string;
  colorCode: string;
  size: string;
  productName: string;
  sKU: string;
  productBarcode: string;
  useGS1: boolean;
  createBy: string;
  createDate: Date;
  editBy: string;
  editDate: Date;
}

export interface ProductTransactionResult {
  warehouse: string | null;
  rFId: string | null;
  productBarcode: string | null;
  sku: string | null;
  itemCode: string | null;
  colorCode: string | null;
  size: string | null;
  receiveNo: string | null;
  receiveDate: string | null; // หรือ Date ถ้าจะ parse เป็น Date ตอนรับข้อมูล
  inType: string | null;
  invoiceNo: string | null;
  invoiceDate: string | null; // หรือ Date
  poNo: string | null;
  uom: string | null;
  outStatus: boolean | null;
  outDate: string | null; // หรือ Date
  outNo: string | null;
  inputBy: string | null;
  inputDate: string | null; // หรือ Date
}
