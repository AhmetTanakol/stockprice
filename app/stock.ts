import StockPrice from './classes/StockPrice';

(() => {
  const stockPrice = new StockPrice();
  stockPrice.parseArguments(process.argv);
  stockPrice.printResult().then(results => {
    console.log(results);
  }).catch((err: Error) => {
    console.log(err.message);
  });
})();