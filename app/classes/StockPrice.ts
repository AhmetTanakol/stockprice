import Stock from './Stock';
import StockPriceOutputService from './StockPriceOutputService';
import DrawndownOutputService from './DrawndownOutputService';
import StockReturnOutputService from './StockReturnOutputService';
import MailService from './MailService';
import {
  drawnDownStringer,
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
  private _drawndownOutputService: DrawndownOutputService;
  private _stockReturnOutputService: StockReturnOutputService;
  private _mailService: MailService;
  private _stocksWithHighestDrawndowns: IStockInformation[];
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
    this._stocksWithHighestDrawndowns = [];
    this._stockPriceOutputService = new StockPriceOutputService();
    this._drawndownOutputService = new DrawndownOutputService();
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

  get drawndownOutputService(): DrawndownOutputService {
    return this._drawndownOutputService;
  }

  get stockReturnOutputService(): StockReturnOutputService {
    return this._stockReturnOutputService;
  }

  get stocksWithHighestDrawndowns(): IStockInformation[] {
    return this._stocksWithHighestDrawndowns;
  }

  set stocksWithHighestDrawndowns(value: IStockInformation[]) {
    this._stocksWithHighestDrawndowns = value;
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

  public async fetchStockPrices(params: any): Promise<void | Error> {
    try {
      this._stockInfo = [];
      const stockData: any = await this.getStockPrices(this._symbol, params);
      this.storeStockPrices(stockData);
      this.orderDrawndowns();
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

  public orderDrawndowns(): void {
    const stocksWithHighestDrawndowns = _.take(_.orderBy(this._stockInfo, ['drawDown'], ['desc'])
                                              , 3);
    if (!_.isEmpty(this.stocksWithHighestDrawndowns)) {
      const mergedDrawndownsArrays =
      this.stocksWithHighestDrawndowns
      .concat(stocksWithHighestDrawndowns)
      .sort((stock1, stock2) => {
        return stock2.drawDown - stock1.drawDown ;
      });
      this.stocksWithHighestDrawndowns = _.take(mergedDrawndownsArrays, 3);
    } else {
      this.stocksWithHighestDrawndowns = stocksWithHighestDrawndowns;
    }
  }

  public async loadData(params: any): Promise<void | Error> {
    try {
      await this.fetchStockPrices(params);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public sendEmailOfStockPrices() {
    const drawnDownsInfo = drawnDownStringer(this._stocksWithHighestDrawndowns);
    const stockPricesInfo = stockPriceStringer(this._stockInfo);
    const returnRate = stockReturnStringer(this.calculateStockReturn());
    const mailData = {
      startDate: this._startDate,
      endDate: this._startDate,
      stockPrices: stockPricesInfo.stockPrices,
      drawnDowns: drawnDownsInfo.drawnDowns,
      maxDrawndown: drawnDownsInfo.maxDrawndown,
      returnRate: returnRate,
      symbol: this._symbol,
    };
    this._mailService.mailData = mailData;
    this._mailService.sendStockPricesEmail();
  }

}

export default StockPrice;
