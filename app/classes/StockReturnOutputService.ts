import { IOutputService } from './OutputService';
import { IStockReturn } from './StockPrice';
import { isEmpty } from 'lodash';
import { stockReturnStringer } from '../utils/index';

class StockReturnOutputService implements IOutputService {

    public createOutput(stockReturn: IStockReturn): string {
      if (isEmpty(stockReturn)) {
        return '';
      }
      return stockReturnStringer(stockReturn);
    }
}

export default StockReturnOutputService;
