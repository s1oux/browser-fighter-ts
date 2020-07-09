import { callApi } from '../helpers/apiHelper';
import { IFighterModel } from '../interfaces/iFighter';

class FighterService {
  async getFighters(): Promise<IFighterModel[]> {
    try {
      const endpoint: string = 'fighters.json';
      const apiResult: IFighterModel[] = await callApi<IFighterModel[]>(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id : string): Promise<IFighterModel> {
    try {
      const endpoint: string = `details/fighter/${id}.json`;
      const apiResult: IFighterModel = await callApi<IFighterModel>(endpoint, 'GET');
      return apiResult;
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
