import StockPrice from './classes/StockPrice';
import config from '../config/config';
import moment from 'moment';
import { head, last } from 'lodash';

/**
 * Main function
 */
(async () => {
  /**
   * Creat a stockprice object and parse command line arguments
   * @type {StockPrice}
   */
  const stockPrice = new StockPrice();
  stockPrice.parseArguments(process.argv);

  /**
   * Limit value is used to limit number of days when data is fetched
   * The amount of data can be huge, so we have to put a limitation
   *
   */
  const limit = config.limit;

  const sDate = moment(new Date(stockPrice.startDate));
  const eDate = stockPrice.endDate !== '' ?
                moment(new Date(stockPrice.endDate)) :
                sDate;
  const dateDiff = eDate.diff(sDate, 'days');
  /**
   * If the given date range is smaller than limit
   * We can fetch all the data at once
   *
   */
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
      const stockPrices = stockPrice.stockPriceOutputService.createOutput(stockPrice.stockInfo);
      const drawnDowns = stockPrice.drawndownOutputService.createOutput(stockPrice.stocksWithHighestDrawndowns);
      const returnRate = stockPrice.stockReturnOutputService.createOutput(stockPrice.calculateStockReturn());
      const results = stockPrices + '\n\n' + drawnDowns + '\n\n' + returnRate;
      console.log(results);
      /**
       * Email is sent when there is a provided test email and email sending is activated
       * Currently, email is sent when all information is fetched at once
       */
      if (config.email === 'active' && config.sendgrid.test_email !== '') {
        stockPrice.sendEmailOfStockPrices();
      }
    } catch (err) {
      throw err;
    }
  } else {
    /**
     * If the given date range is larger than limit
     * We get data for the first n days (n is equal to limit)
     * Increment n by the value of limit until we fetch data for all days
     *
     */
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
        /**
         * Stock prices should be displayed at every step
         * Maximum drawndowns and return rate are displayed only at the end
         *
         */
        let results = stockPrice.stockPriceOutputService.createOutput(stockPrice.stockInfo);
        if (numberOfRequests === 0) {
          stockPrice.lastStockInfo = last(stockPrice.stockInfo);
          const drawnDowns = stockPrice.drawndownOutputService.createOutput(stockPrice.stocksWithHighestDrawndowns);
          const returnRate = stockPrice.stockReturnOutputService.createOutput(stockPrice.calculateStockReturn());
          results += '\n\n' + drawnDowns + '\n\n' + returnRate;
        }
        numberOfRequests -= 1;
        console.log(results);
      } catch (err) {
        throw err;
      }
      /**
       * Set the next start date and end date
       * Momentjs is used to handle date operations
       * However some mutability issues exist
       * I had to create a new moment object whenever I need a new date
       * To eliminate duplicate results, I always set the next start day to endDate + 1
       *
       */
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
