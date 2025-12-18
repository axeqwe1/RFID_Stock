import { RFIDRepository } from "../../repositroy/RFIDRepository";
import { RFIDService } from "../../service/RFIDService";

export const useRFIDComposables = async () => {
  const NewRepository = new RFIDRepository();
  const _service = new RFIDService(NewRepository);

  const GetAllRfidData = async () => {
    try {
      const data = await _service.GetAllRFID();
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  return { GetAllRfidData };
};
