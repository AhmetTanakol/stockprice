import Stock from './Stock';
import StockPriceOutputService from './StockPriceOutputService';
import DrawdownOutputService from './DrawdownOutputService';
import StockReturnOutputService from './StockReturnOutputService';
import MailService from './MailService';
import {
  drawDownStringer,
  round,
  stockPriceStringer,
  stockReturnStringer
} from '../utils/index';
import * as _ from 'lodash';
import moment from 'moment';

export interface IStockInformation {
  date: string;
  highestPrice: number;
  lowestPrice: number;
  closePrice: number;
  drawDown: number;
}

export interface IStockReturn {
  returnOfStock?: number;
  returnRate?: number;
  lastStockInfo?: IStockInformation;
  initialStockInfo?: IStockInformation;
}

class StockPrice extends Stock  {
  private _apiKey: string;
  private _startDate: string;
  private _symbol: string;
  private _stockInfo: IStockInformation[];
  private _stockPriceOutputService: StockPriceOutputService;
  private _drawdownOutputService: DrawdownOutputService;
  private _stockReturnOutputService: StockReturnOutputService;
  private _mailService: MailService;
  private _stocksWithHighestDrawdowns: IStockInformation[];
  private _lastStockInfo: IStockInformation;
  private _initialStockInfo: IStockInformation;
  private _endDate?: string;

  constructor() {
    super();

    this._apiKey = '';
    this._symbol = '';
    this._startDate = '';
    this._endDate = '';
    this._stockInfo = [];
    this._stocksWithHighestDrawdowns = [];
    this._stockPriceOutputService = new StockPriceOutputService();
    this._drawdownOutputService = new DrawdownOutputService();
    this._stockReturnOutputService = new StockReturnOutputService();
    this._mailService = new MailService();
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

  get stockPriceOutputService(): StockPriceOutputService {
    return this._stockPriceOutputService;
  }

  get drawdownOutputService(): DrawdownOutputService {
    return this._drawdownOutputService;
  }

  get stockReturnOutputService(): StockReturnOutputService {
    return this._stockReturnOutputService;
  }

  get stocksWithHighestDrawdowns(): IStockInformation[] {
    return this._stocksWithHighestDrawdowns;
  }

  set stocksWithHighestDrawdowns(value: IStockInformation[]) {
    this._stocksWithHighestDrawdowns = value;
  }

  get lastStockInfo(): IStockInformation {
    return this._lastStockInfo;
  }

  get initialStockInfo(): IStockInformation {
    return this._initialStockInfo;
  }

  set lastStockInfo(value: IStockInformation) {
    this._lastStockInfo = value;
  }

  set initialStockInfo(value: IStockInformation) {
    this._initialStockInfo = value;
  }

  /**
   * Argument parser for a specific input
   * Input Example:
   * ts-node app/stock.ts "API_KEY=Gy-GuEPqtyvM4u1SvooJ" "AAPL" "Jan" "1" "2018" "-" "Feb" "5" "2018"
   */
  public parseArguments(args: string[]): void {
    if (!_.isEmpty(args)) {
      const sDate = args[6] + args[4] + args[5];
      const eDate = args[8] ? args[10] + args[8] + args[9] : '';
      const apiKey = args[2].split('=')[1];
      const symbol = args[3];
      const startDate = moment(new Date(sDate)).format('YYYY-MM-DD');
      const endDate = eDate !== '' ?
                      moment(new Date(eDate)).format('YYYY-MM-DD') :
                      sDate;

      this._apiKey = apiKey;
      this._symbol = symbol;
      this._startDate = startDate;
      this._endDate = endDate;
      this._stockInfo = [];
    }
  }

  /**
   * Fetch stock prices, store the retrieved information for using data
   * Set maximum drawdowns
   * @param params
   * @returns {Promise<void | Error>}
   */
  public async fetchStockPrices(params: any): Promise<void | Error> {
    try {
      this._stockInfo = [];
      const stockData: any = await this.getStockPrices(this._symbol, params);
      this.storeStockPrices(stockData);
      this.orderDrawdowns();
      return Promise.resolve(stockData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Store data and calculate drawndowns
   * @param stockData
   */
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

  /**
   * Calculate stock return
   * @returns {IStockReturn}
   */
  public calculateStockReturn(): IStockReturn {
    if (this.lastStockInfo === undefined || this.initialStockInfo === undefined) {
      return {};
    }
    const lastValue = this.lastStockInfo.closePrice;
    const initialValue = this.initialStockInfo.closePrice;

    return {
      returnOfStock: lastValue - initialValue,
      returnRate: round(((lastValue - initialValue) / initialValue) * 100),
      lastStockInfo: this.lastStockInfo,
      initialStockInfo: this.initialStockInfo
    };
  }

  /**
   * Find first 3 drawndowns
   * If there exist entries in the stocksWithHighestDrawdowns
   * This means we run the program multiple times
   * In order to find first 3 drawndowns, we need to see all the data
   * Merge 2 sorted arrays (old one and the new one) and get first 3 entries
   */
  public orderDrawdowns(): void {
    const stocksWithHighestDrawdowns = _.take(_.orderBy(this._stockInfo, ['drawDown'], ['desc'])
                                              , 3);
    if (!_.isEmpty(this.stocksWithHighestDrawdowns)) {
      const mergedDrawdownsArrays =
      this.stocksWithHighestDrawdowns
      .concat(stocksWithHighestDrawdowns)
      .sort((stock1, stock2) => {
        return stock2.drawDown - stock1.drawDown ;
      });
      this.stocksWithHighestDrawdowns = _.take(mergedDrawdownsArrays, 3);
    } else {
      this.stocksWithHighestDrawdowns = stocksWithHighestDrawdowns;
    }
  }

  public async loadData(params: any): Promise<void | Error> {
    try {
      await this.fetchStockPrices(params);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Send email
   * Format can be changed here, however email template should be updated
   */
  public sendEmailOfStockPrices() {
    const drawDownsInfo = drawDownStringer(this._stocksWithHighestDrawdowns);
    const stockPricesInfo = stockPriceStringer(this._stockInfo);
    const returnRate = stockReturnStringer(this.calculateStockReturn());
    const mailData = {
      startDate: this._startDate,
      endDate: this._startDate,
      stockPrices: stockPricesInfo.stockPrices,
      drawDowns: drawDownsInfo.drawDowns,
      maxDrawdown: drawDownsInfo.maxDrawdown,
      returnRate: returnRate,
      symbol: this._symbol,
    };
    this._mailService.mailData = mailData;
    this._mailService.sendStockPricesEmail();
  }

}

export default StockPrice;
