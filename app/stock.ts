import StockPrice from './classes/StockPrice';
import config from '../config/config';
import moment from 'moment';
import { head, last } from 'lodash';

(async () => {
  const stockPrice = new StockPrice();
  stockPrice.parseArguments(process.argv);
  const limit = config.limit;
  const sDate = moment(new Date(stockPrice.startDate));
  const eDate = moment(new Date(stockPrice.endDate));
  const dateDiff = eDate.diff(sDate, 'days');
  if (dateDiff <= limit) {
    try {
      const params = {
        api_key: stockPrice.apiKey,
        order: 'asc',
        start_date: stockPrice.startDate,
        end_date: stockPrice.endDate
      };
      await stockPrice.loadData(params);
    } catch (err) {
      throw err;
    }
    try {
      stockPrice.lastStockInfo = last(stockPrice.stockInfo);
      stockPrice.initialStockInfo = head(stockPrice.stockInfo);
      const results =
        stockPrice.stockPriceOutputService.createOutput(stockPrice.stockInfo) +
        '\n\n' +
        stockPrice.drawndownOutputService.createOutput(stockPrice.stocksWithHighestDrawndowns) +
        '\n\n' +
        stockPrice.stockReturnOutputService.createOutput(stockPrice.calculateStockReturn());
      console.log(results);
    } catch (err) {
      throw err;
    }
  } else {
    let numberOfRequests = Math.floor(dateDiff / limit);
    let startDate = moment(new Date(stockPrice.startDate)).format('YYYY-MM-DD');
    let endDate = moment(new Date(stockPrice.startDate)).add(limit, 'days').format('YYYY-MM-DD');
    let isInitialStockInfoSet = false;
    while (numberOfRequests >= 0) {
      try {
        const params = {
          api_key: stockPrice.apiKey,
          order: 'asc',
          start_date: startDate,
          end_date: endDate
        };
        await stockPrice.loadData(params);
        if (!isInitialStockInfoSet) {
          stockPrice.initialStockInfo = head(stockPrice.stockInfo);
          isInitialStockInfoSet = true;
        }
      } catch (err) {
        throw err;
      }
      try {
        let results = stockPrice.stockPriceOutputService.createOutput(stockPrice.stockInfo);
        if (numberOfRequests === 0) {
          stockPrice.lastStockInfo = last(stockPrice.stockInfo);
          results += '\n\n' +
                      stockPrice.drawndownOutputService
                      .createOutput(stockPrice.stocksWithHighestDrawndowns) +
                      '\n\n' +
                      stockPrice.stockReturnOutputService
                      .createOutput(stockPrice.calculateStockReturn());
        }
        numberOfRequests -= 1;
        console.log(results);
      } catch (err) {
        throw err;
      }
      startDate = moment(new Date(endDate)).add(1, 'days').format('YYYY-MM-DD');
      const currentDateDiff = eDate.diff(startDate, 'days');

      if (currentDateDiff < limit) {
        endDate = moment(new Date(startDate)).add(currentDateDiff, 'days').format('YYYY-MM-DD');
      } else {
        endDate = moment(new Date(startDate)).add(limit, 'days').format('YYYY-MM-DD');
      }
    }
  }
})();
