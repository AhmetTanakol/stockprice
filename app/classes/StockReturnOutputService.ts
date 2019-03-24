import { IOutputService } from './OutputService';
import { IStockReturn } from './StockPrice';
import { isEmpty } from 'lodash';

class StockReturnOutputService implements IOutputService {

    public createOutput(stockReturn: IStockReturn): string {
      if (isEmpty(stockReturn)) {
        return '';
      }
      const returnRate = stockReturn.returnRate > 0 ?
        `+${stockReturn.returnRate}` : `${stockReturn.returnRate}`;
      const outputOfStockReturn =
        `Return: ${stockReturn.returnOfStock} [${returnRate}%] ` +
        `(${stockReturn.initialStockInfo.closePrice} on ${stockReturn.initialStockInfo.date} -> ` +
        `${stockReturn.lastStockInfo.closePrice} on ${stockReturn.lastStockInfo.date})\n`;

      return outputOfStockReturn;
    }
}

export default StockReturnOutputService;
