import { IOutputService } from './OutputService';
import { IStockInformation } from '../classes/StockPrice';
import { each, isEmpty, trim } from 'lodash';
import { stockPriceStringer } from '../utils/index';

/**
 * A service to create strings to display stock price information on console
 */
class StockPriceOutputService implements IOutputService {

    public createOutput(stockInfo: IStockInformation[]): string {
        if (isEmpty(stockInfo)) {
            return '';
        }
        let stockPrices = '';
        const stockPricesInfo = stockPriceStringer(stockInfo);
        each(stockPricesInfo.stockPrices, sP => {
            stockPrices += sP.stockPrice + '\n';
        });

        return trim(stockPrices);
    }
}

export default StockPriceOutputService;
