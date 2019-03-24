import StockPriceOutputService from '../../app/classes/StockPriceOutputService';

describe ('StockPriceOutputService Tests', () => {
  test('return output for stock prices', async done => {
    const stockPriceOutputService = new StockPriceOutputService();
    const stockInfo = [
        {
          date: '23.03.2018',
          highestPrice: 169.92,
          lowestPrice: 164.94,
          closePrice: 164.94,
          drawDown: 2.9,
        },
        {
          date: '26.03.2018',
          highestPrice: 173.1,
          lowestPrice: 166.44,
          closePrice: 172.77,
          drawDown: 3.8,
        },
        {
          date: '27.03.2018',
          highestPrice: 175.15,
          lowestPrice: 166.92,
          closePrice: 168.34,
          drawDown: 4.7,
        }
      ];
    const outputOfStockPrices = stockPriceOutputService.createOutput(stockInfo);
    const expectedResult = '23.03.2018: Closed at 164.94 (164.94 ~ 169.92)\n' +
    '26.03.2018: Closed at 172.77 (166.44 ~ 173.1)\n' +
    '27.03.2018: Closed at 168.34 (166.92 ~ 175.15)';
    expect(outputOfStockPrices).toEqual(expectedResult);
    done();
  });

});
