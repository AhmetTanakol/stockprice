import config from '../../config/config';
import axios from 'axios';

abstract class Stock {

  protected async getStockPrices(symbol: string, params: any): Promise<void | Error> {
    try {
      const url = `${config.quandl.api_endpoint}${symbol}/data.json?`;
      const response = await axios({
        method: 'get',
        url,
        params
      });
      return Promise.resolve(response.data.dataset_data.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected abstract parseArguments(args: string[]);
}

export default Stock;
