import StockPrice from '../../app/classes/StockPrice';
import Stock from '../../app/classes/Stock';

describe ('StockPrice Tests', () => {
  test('created object type should be instance of StockPrice and Stock', done => {
    const stockPrice: StockPrice = new StockPrice();
    expect(stockPrice instanceof StockPrice).toBeTruthy();
    expect(stockPrice instanceof Stock).toBeTruthy();
    done();
  });

  test('create object and set constructor fields', done => {
    const stockPrice: StockPrice = new StockPrice();

    expect(stockPrice.apiKey).toEqual('');
    expect(stockPrice.symbol).toEqual('');
    expect(stockPrice.startDate).toEqual('');
    expect(stockPrice.endDate).toEqual('');
    expect(stockPrice.stockInfo).toEqual([]);

    stockPrice.apiKey = 'test';
    stockPrice.symbol = 'AAPL';
    stockPrice.startDate = '2018-01-01';
    stockPrice.endDate = '2018-01-01';
    stockPrice.stockInfo = [{
      date: '2018-01-01',
      highestPrice: 12.12,
      lowestPrice: 1.1,
      closePrice: 10,
    }];
    expect(stockPrice.apiKey).toEqual('test');
    expect(stockPrice.symbol).toEqual('AAPL');
    expect(stockPrice.startDate).toEqual('2018-01-01');
    expect(stockPrice.endDate).toEqual('2018-01-01');
    expect(stockPrice.stockInfo).toEqual([{
      date: '2018-01-01',
      highestPrice: 12.12,
      lowestPrice: 1.1,
      closePrice: 10,
    }]);
    done();
  });

  test('create object and set constructor fields via argument parser', done => {
    const stockPrice: StockPrice = new StockPrice();

    expect(stockPrice.apiKey).toEqual('');
    expect(stockPrice.symbol).toEqual('');
    expect(stockPrice.startDate).toEqual('');
    expect(stockPrice.endDate).toEqual('');
    expect(stockPrice.stockInfo).toEqual([]);

    const args: string[] = ['ts-node', 'app/stock.ts', 'API_KEY=Gy-GuEPqtyvM4u1SvooJ',
                            'AAPL', 'Jan', '1', '2018', '-', 'Jan', '5', '2018'];
    stockPrice.parseArguments(args);

    expect(stockPrice.apiKey).toEqual('Gy-GuEPqtyvM4u1SvooJ');
    expect(stockPrice.symbol).toEqual('AAPL');
    expect(stockPrice.startDate).toEqual('2018-01-01');
    expect(stockPrice.endDate).toEqual('2018-01-05');
    expect(stockPrice.stockInfo.length).toEqual(0);
    done();
  });

  test('order stock prices', done => {
    const stockPrice: StockPrice = new StockPrice();
    const stockData = [
      [
        '2018-03-27',
        175.15,
        166.92,
        168.34
      ],
      [
        '2018-03-26',
        168.07,
        166.44,
        172.77
      ],
      [
        '2018-03-23',
        169.92,
        164.94,
        164.94
      ]
    ];
    const orderedList = stockPrice.orderStockPrices(stockData);
    expect(orderedList).toEqual(stockData.reverse());
    done();
  });

  test('store stock prices', async done => {
    const stockPrice: StockPrice = new StockPrice();
    const stockData = [
      [
        '2018-03-27',
        173.68,
        175.15,
        166.92,
        168.34
      ],
      [
        '2018-03-26',
        168.07,
        173.1,
        166.44,
        172.77
      ],
      [
        '2018-03-23',
        168.39,
        169.92,
        164.94,
        164.94
      ]
    ];
    stockPrice.storeStockPrices(stockData);
    expect(stockPrice.stockInfo.length).toEqual(3);
    const stockInfo = [
      {
        date: '23.03.2018',
        highestPrice: 169.92,
        lowestPrice: 164.94,
        closePrice: 164.94
      },
      {
        date: '26.03.2018',
        highestPrice: 173.1,
        lowestPrice: 166.44,
        closePrice: 172.77
      },
      {
        date: '27.03.2018',
        highestPrice: 175.15,
        lowestPrice: 166.92,
        closePrice: 168.34
      }
    ];
    expect(stockPrice.stockInfo).toEqual(stockInfo);
    done();
  });

  test('store stock prices', async done => {
    const stockPrice: StockPrice = new StockPrice();
    const stockData = [
      [
        '2018-03-27',
        173.68,
        175.15,
        166.92,
        168.34
      ],
      [
        '2018-03-26',
        168.07,
        173.1,
        166.44,
        172.77
      ],
      [
        '2018-03-23',
        168.39,
        169.92,
        164.94,
        164.94
      ]
    ];
    stockPrice.storeStockPrices(stockData);
    expect(stockPrice.stockInfo.length).toEqual(3);
    const stockInfo = [
      {
        date: '23.03.2018',
        highestPrice: 169.92,
        lowestPrice: 164.94,
        closePrice: 164.94
      },
      {
        date: '26.03.2018',
        highestPrice: 173.1,
        lowestPrice: 166.44,
        closePrice: 172.77
      },
      {
        date: '27.03.2018',
        highestPrice: 175.15,
        lowestPrice: 166.92,
        closePrice: 168.34
      }
    ];
    expect(stockPrice.stockInfo).toEqual(stockInfo);
    done();
  });

  test('get stock prices', async done => {
    const stockPrice: StockPrice = new StockPrice();
    const args: string[] = ['ts-node', 'app/stock.ts', 'API_KEY=Gy-GuEPqtyvM4u1SvooJ',
                            'AAPL', 'Jan', '1', '2018', '-', 'Jan', '2', '2018'];
    stockPrice.parseArguments(args);
    stockPrice.getStockprices().then(() => {
      expect(stockPrice.stockInfo.length).not.toEqual(0);
      done();
    });
  });

  test('print stock prices', async done => {
    const stockPrice: StockPrice = new StockPrice();
    const args: string[] = ['ts-node', 'app/stock.ts', 'API_KEY=Gy-GuEPqtyvM4u1SvooJ',
                            'AAPL', 'Jan', '1', '2018', '-', 'Jan', '2', '2018'];
    stockPrice.parseArguments(args);
    stockPrice.printResult().then((result: string) => {
      expect(result).toEqual('02.01.2018: Closed at 172.26 (169.26 ~ 172.3)\n');
      done();
    });
  });

  test('get error on fetching stock prices', async done => {
    const stockPrice: StockPrice = new StockPrice();
    const args: string[] = ['ts-node', 'app/stock.ts', 'API_KEY=XXXX',
                            'AAPL', 'Jan', '1', '2018', '-', 'Jan', '2', '2018'];
    stockPrice.parseArguments(args);
    stockPrice.printResult()
      .catch(err => {
        expect(err).toBeDefined();
        done();
      });
  });
});
