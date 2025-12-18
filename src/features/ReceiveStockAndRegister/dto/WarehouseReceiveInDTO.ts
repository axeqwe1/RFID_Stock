import type { WarehouseRFIdItem } from "./CreateWarehouseReceiveDTO";

export interface WarehouseReceiveInDTO {
  receiveNo?: string | null;
  receiveDate?: string | Date | null;
  receiveType?: string | null;
  companyCode?: string | null;
  deliveryNo?: string | null;
  invoiceNo?: string | null;
  invoiceDate?: string | Date | null;
  warehouse?: string | null;
  createdBy?: string | null;
  remark?: string | null;
  rfidlist?: WarehouseRFIdItem[] | null;
}
