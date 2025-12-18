import { FPSProductOnlineTransRepository } from "../../repositroy/FPSProductOnlineTransRepository";
import { FPSProductOnlineTransService } from "../../service/FPSProductOnlineTransService";

export const useFPSProductTransCompose = () => {
  const repository = new FPSProductOnlineTransRepository();
  const service = new FPSProductOnlineTransService(repository);
  const getTrans = async () => {
    try {
      const data = await service.GetAll();
      return data.GetAll();
    } catch (err: any) {
      throw err;
    }
  };

  return { getTrans };
};
