import StockReturnOutputService from '../../app/classes/StockReturnOutputService';
import { IStockInformation, IStockReturn } from '../../app/classes/StockPrice';

describe ('StockReturnOutputService Tests', () => {
  test('return output for stock return', async done => {
    const stockReturnOutputService = new StockReturnOutputService();
    const initialStockInfo: IStockInformation = {
        date: '02.01.2018',
        highestPrice: 175.1,
        lowestPrice: 161.44,
        closePrice: 172.26,
        drawDown: 3.8,
     };
    const lastStockInfo: IStockInformation = {
        date: '05.01.2018',
        highestPrice: 173.1,
        lowestPrice: 166.44,
        closePrice: 175.0,
        drawDown: 3.8,
     };
    const stockInfo: IStockReturn = {
         returnOfStock: 2.740000000000009,
         returnRate: 1.6,
         lastStockInfo,
         initialStockInfo
    };
    const outputOfStockPrices = stockReturnOutputService.createOutput(stockInfo);
    const expectedResult = 'Return: 2.740000000000009 [+1.6%] ' +
    '(172.26 on 02.01.2018 -> 175 on 05.01.2018)\n';
    expect(outputOfStockPrices).toEqual(expectedResult);
    done();
  });

});
