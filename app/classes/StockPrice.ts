import Stock from './Stock';
import config from '../../config/config';
import axios from 'axios';
import * as _ from 'lodash';
import moment from 'moment';

interface StockInformationI {
  date: string;
  highestPrice: number;
  lowestPrice: number;
  closePrice: number;
}

interface StockPricesI {
  getStockprices();
  calculateReturnRate();
  calculateDrawndowns();
}

class StockPrice extends Stock implements StockPricesI  {
  private _apiKey: string;
  private _startDate: string;
  private _symbol: string;
  private _stockInfo: StockInformationI[];
  private _endDate?: string;


  constructor() {
    super();

    this._apiKey = '';
    this._symbol = '';
    this._startDate = '';
    this._endDate = '';
    this._stockInfo = [];
  }

  get apiKey(): string {
    return this._apiKey;
  }

  set apiKey(value: string) {
    this._apiKey = value;
  }

  get startDate(): string {
    return this._startDate;
  }

  set startDate(value: string) {
    this._startDate = value;
  }

  get symbol(): string {
    return this._symbol;
  }

  set symbol(value: string) {
    this._symbol = value;
  }

  get stockInfo(): StockInformationI[] {
    return this._stockInfo;
  }

  set stockInfo(value: StockInformationI[]) {
    this._stockInfo = value;
  }

  get endDate(): string {
    return this._endDate;
  }

  set endDate(value: string) {
    this._endDate = value;
  }

  orderStockPrices(stockData: any): any {
    return _.sortBy(stockData,  data => {
      if (!_.isEmpty(data)) {
        return data[0];
      }
    });
  }

  storeStockPrices(stockData: any): void {
    const sortedStockData = this.orderStockPrices(stockData);
    _.each(sortedStockData, stockData => {
      let date = moment(new Date(stockData[0])).format('DD.MM.YYYY');
      let closePrice = stockData[4];
      let highestPrice = stockData[2];
      let lowestPrice = stockData[3];
      this._stockInfo.push({ date, highestPrice, lowestPrice, closePrice });
    });
  }

  async getStockprices(): Promise<void | Error> {
    try {
      let params = {
        api_key: this._apiKey
      };

      if (this._endDate === '') {
        params['start_date'] = this._startDate;
      } else {
        params['start_date'] = this._startDate;
        params['end_date'] = this._endDate;
      }

      const url = `${config.quandl.api_endpoint}${this._symbol}/data.json?`;
      const response = await axios({
        method: 'get',
        url,
        params
      });
      this.storeStockPrices(response.data.dataset_data.data);
    } catch (error) {
      return Promise.reject(error);
    }

  }

  calculateReturnRate() {
    return '';
  }

  calculateDrawndowns() {
    return '';
  }

  parseArguments(args: string[]): void {
    if (!_.isEmpty(args)) {
      const sDate = args[6] + args[4] + args[5];
      const eDate = args[8] ? args[10] + args[8] + args[9] : '';
      const apiKey = args[2].split('=')[1];
      const symbol = args[3];
      const startDate = moment(new Date(sDate)).format('YYYY-MM-DD');
      const endDate = moment(new Date(eDate)).format('YYYY-MM-DD');

      this._apiKey = apiKey;
      this._symbol = symbol;
      this._startDate = startDate;
      this._endDate = endDate;
      this._stockInfo = [];
    }
  }

  async printResult(): Promise<string | Error> {
    try {
      await this.getStockprices();
      let stockPrices = '';
      _.each(this._stockInfo, (dailyStockInfo: StockInformationI) => {
        stockPrices += `${dailyStockInfo.date}: Closed at ${dailyStockInfo.closePrice} ` +
          `(${dailyStockInfo.lowestPrice} ~ ${dailyStockInfo.highestPrice})\n`;
      });

      return Promise.resolve(stockPrices);
    } catch (err) {
      return Promise.reject(err);
    }
  }

}

export default StockPrice;
