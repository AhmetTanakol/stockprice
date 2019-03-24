import DrawdownOutputService from '../../app/classes/DrawdownOutputService';

describe ('DrawdownOutputService Tests', () => {
  test('return output for drawdowns', async done => {
    const drawdownOutputService = new DrawdownOutputService();
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
    const outputOfStockPrices = drawdownOutputService.createOutput(stockInfo);
    const expectedResult = 'First 3 Drawdowns:\n' +
    '-2.9% (169.92 on 23.03.2018 -> 164.94 on 23.03.2018)\n' +
    '-3.8% (173.1 on 26.03.2018 -> 166.44 on 26.03.2018)\n' +
    '-4.7% (175.15 on 27.03.2018 -> 166.92 on 27.03.2018)\n' +
    '\nMaximum drawdown: -2.9% (169.92 on 23.03.2018 -> 164.94 on 23.03.2018)';
    expect(outputOfStockPrices).toEqual(expectedResult);
    done();
  });

});
