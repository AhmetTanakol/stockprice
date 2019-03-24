import { IOutputService } from './OutputService';
import { IStockReturn } from './StockPrice';
import { isEmpty } from 'lodash';
import { stockReturnStringer } from '../utils/index';

/**
 * A service to create strings to display stock return information on console
 */
class StockReturnOutputService implements IOutputService {

    public createOutput(stockReturn: IStockReturn): string {
      if (isEmpty(stockReturn)) {
        return '';
      }
      return stockReturnStringer(stockReturn);
    }
}

export default StockReturnOutputService;
