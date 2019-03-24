import { IOutputService } from './OutputService';
import { IStockInformation } from '../classes/StockPrice';
import { each, isEmpty } from 'lodash';
import { drawDownStringer } from '../utils/index';

/**
 * A service to create strings to display drawdown information on console
 */
class DrawdownOutputService implements IOutputService {

    public createOutput(stocksWithHighestDrawdowns: IStockInformation[]): string {
        if (isEmpty(stocksWithHighestDrawdowns)) {
            return '';
        }
        const drawDownsInfo = drawDownStringer(stocksWithHighestDrawdowns);
        let drawDowns = 'First 3 Drawdowns:\n';
        each(drawDownsInfo.drawDowns, dD => {
          drawDowns += dD.drawDown + '\n';
        });
        drawDowns += '\n' + drawDownsInfo.maximumDrawdown;

        return drawDowns;
    }
}

export default DrawdownOutputService;
