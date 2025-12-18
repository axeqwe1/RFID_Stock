import type { MasterWarehouseFPS } from "../../types/warehouseFpsType";

export class FPSWarehouseEntity {
  private fpsWarehouseData: MasterWarehouseFPS[];
  constructor(fpsWarehouseData: MasterWarehouseFPS[]) {
    this.fpsWarehouseData = [...fpsWarehouseData];
  }

  GetAllFPSWarehouseData() {
    return [...this.fpsWarehouseData];
  }

  GetFPSWarehouseDataById(id: string) {
    if (!id?.trim()) return null;
    return this.fpsWarehouseData.find((item) => item.warehouse === id) || null;
  }

  // เพิ่ม business logic
  GetActiveWarehouses() {
    return this.fpsWarehouseData.filter((item) => !item.cancel);
  }
}
