import { IOutputService } from './OutputService';
import { IStockInformation } from '../classes/StockPrice';
import { each, isEmpty } from 'lodash';
import { drawnDownStringer } from '../utils/index';

class DrawndownOutputService implements IOutputService {

    public createOutput(stocksWithHighestDrawndowns: IStockInformation[]): string {
        if (isEmpty(stocksWithHighestDrawndowns)) {
            return '';
        }
        const drawnDownsInfo = drawnDownStringer(stocksWithHighestDrawndowns);
        let drawnDowns = 'First 3 Drawndowns:\n';
        each(drawnDownsInfo.drawnDowns, dD => {
          drawnDowns += dD.drawnDown + '\n';
        });
        drawnDowns += '\n' + drawnDownsInfo.maximumDrawndown;

        return drawnDowns;
    }
}

export default DrawndownOutputService;
