import Stock from './Stock';
import StockPriceOutputService from './StockPriceOutputService';
import DrawndownOutputService from './DrawndownOutputService';
import { round } from '../utils/index';
import * as _ from 'lodash';
import moment from 'moment';

export interface IStockInformation {
  date: string;
  highestPrice: number;
  lowestPrice: number;
  closePrice: number;
  drawDown: number;
}

class StockPrice extends Stock  {
  private _apiKey: string;
  private _startDate: string;
  private _symbol: string;
  private _stockInfo: IStockInformation[];
  private stockPriceOutputService: StockPriceOutputService;
  private drawndownOutputService: DrawndownOutputService;
  private _endDate?: string;

  constructor() {
    super();

    this._apiKey = '';
    this._symbol = '';
    this._startDate = '';
    this._endDate = '';
    this._stockInfo = [];
    this.stockPriceOutputService = new StockPriceOutputService();
    this.drawndownOutputService = new DrawndownOutputService();
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

  get stockInfo(): IStockInformation[] {
    return this._stockInfo;
  }

  set stockInfo(value: IStockInformation[]) {
    this._stockInfo = value;
  }

  get endDate(): string {
    return this._endDate;
  }

  set endDate(value: string) {
    this._endDate = value;
  }

  public parseArguments(args: string[]): void {
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

  public async printResult(): Promise<string | Error> {
    try {
      const result = await this.createResultString();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async fetchStockPrices(): Promise<void | Error> {
    try {
      const params = {
        api_key: this._apiKey,
        order: 'asc',
        start_date: this._startDate,
        end_date: this._endDate
      };

      const stockData: any = await this.getStockPrices(this._symbol, params);
      this.storeStockPrices(stockData);
      return Promise.resolve(stockData);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public storeStockPrices(stockData: any): void {
    _.each(stockData, (data: any) => {
      const date = moment(new Date(data[0])).format('DD.MM.YYYY');
      const closePrice = data[4];
      const highestPrice = data[2];
      const lowestPrice = data[3];
      const drawDown = round(((highestPrice - lowestPrice) / highestPrice ) * 100);
      this._stockInfo.push({ date, highestPrice, lowestPrice, closePrice, drawDown });
    });
  }

  public calculateReturnRate() {
    return '';
  }

  public orderDrawndowns() {
    return _.orderBy(this.stockInfo, ['drawDown'], ['desc']);
  }

  public async createResultString(): Promise<string | Error> {
    try {
      await this.fetchStockPrices();
      const outputOfStockPrices = this.stockPriceOutputService.createOutput(this._stockInfo);
      const stocksWithHighestDrawndowns  = _.take(this.orderDrawndowns(), 3);
      const outputOfDrawndowns =
        this.drawndownOutputService.createOutput(stocksWithHighestDrawndowns);
      return Promise.resolve(outputOfStockPrices + '\n\n' + outputOfDrawndowns);
    } catch (err) {
      return Promise.reject(err);
    }
  }

}

export default StockPrice;
