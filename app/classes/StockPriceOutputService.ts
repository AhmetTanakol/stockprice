import { IOutputService } from './OutputService';
import { IStockInformation } from '../classes/StockPrice';
import { each, isEmpty, trim } from 'lodash';

class StockPriceOutputService implements IOutputService {

    public createOutput(stockInfo: IStockInformation[]): string {
        if (isEmpty(stockInfo)) {
            return '';
        }
        let stockPrices = '';
        each(stockInfo, (dailyStockInfo: IStockInformation) => {
            stockPrices += `${dailyStockInfo.date}: Closed at ${dailyStockInfo.closePrice} ` +
                        `(${dailyStockInfo.lowestPrice} ~ ${dailyStockInfo.highestPrice})\n`;
        });

        return trim(stockPrices);
    }
}

export default StockPriceOutputService;
