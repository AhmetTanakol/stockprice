import StockPrice from './classes/StockPrice';

(async () => {
  const stockPrice = new StockPrice();
  stockPrice.parseArguments(process.argv);
  try {
    await stockPrice.loadData();
  } catch (loadError) {
    throw loadError;
  }
  stockPrice.printResult().then(results => {
    console.log(results);
  }).catch((err: Error) => {
    console.log(err.message);
  });
})();
