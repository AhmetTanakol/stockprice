import { IOutputService } from './OutputService';
import { IStockInformation } from '../classes/StockPrice';
import { each } from 'lodash';

class DrawndownOutputService implements IOutputService {

    public createOutput(stocksWithHighestDrawndowns: IStockInformation[]): string {
        let drawnDowns = 'First 3 Drawndowns:\n';
        each(stocksWithHighestDrawndowns, (stock: IStockInformation) => {
          drawnDowns += `-${stock.drawDown}% (${stock.highestPrice} on ${stock.date} -> ` +
                        `${stock.lowestPrice} on ${stock.date})\n`;
        });
        const stockWithHighestDD = stocksWithHighestDrawndowns[0];
        drawnDowns += `\nMaximum drawdown: -${stockWithHighestDD.drawDown}% ` +
                      `(${stockWithHighestDD.highestPrice} on ${stockWithHighestDD.date} -> ` +
                      `${stockWithHighestDD.lowestPrice} on ${stockWithHighestDD.date})`;

        return drawnDowns;
    }
}

export default DrawndownOutputService;
