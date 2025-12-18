import { ref } from "vue";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";

export const productTransactionColumns = [
  { field: "warehouse", header: "Warehouse", filter: true },
  { field: "rFId", header: "RFID", filter: true },
  { field: "productBarcode", header: "Barcode", filter: true },
  { field: "sku", header: "SKU", filter: true },
  { field: "itemCode", header: "ItemCode", filter: true },
  { field: "colorCode", header: "Color", filter: true },
  { field: "size", header: "Size", filter: true },
  { field: "receiveNo", header: "Receive No", filter: true },

  {
    field: "receiveDate",
    header: "Receive Date",
    dataType: "date",
    filter: true,
  },
  { field: "inType", header: "In Type", filter: true },
  { field: "invoiceNo", header: "Invoice No", filter: true },

  {
    field: "invoiceDate",
    header: "Invoice Date",
    dataType: "date",
    filter: true,
  },

  { field: "poNo", header: "PO No", filter: true },
  { field: "uom", header: "UOM", filter: true },

  {
    field: "outStatus",
    header: "Out Status",
    dataType: "boolean",
    filter: true,
  },

  {
    field: "outDate",
    header: "Out Date",
    dataType: "date",
    filter: true,
  },

  { field: "outNo", header: "Out No", filter: true },
  { field: "inputBy", header: "Input By", filter: true },

  {
    field: "inputDate",
    header: "Input Date",
    dataType: "date",
    filter: true,
  },
];
