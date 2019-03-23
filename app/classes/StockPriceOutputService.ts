import { IOutputService } from './OutputService';
import { IStockInformation } from '../classes/StockPrice';
import { each } from 'lodash';

class StockPriceOutputService implements IOutputService {

    public createOutput(stockInfo: IStockInformation[]): string {
        let stockPrices = '';
        each(stockInfo, (dailyStockInfo: IStockInformation) => {
            stockPrices += `${dailyStockInfo.date}: Closed at ${dailyStockInfo.closePrice} ` +
                        `(${dailyStockInfo.lowestPrice} ~ ${dailyStockInfo.highestPrice})\n`;
        });

        return stockPrices;
    }
}

export default StockPriceOutputService;
