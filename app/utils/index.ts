import { IStockInformation, IStockReturn } from '../classes/StockPrice';
import * as _ from 'lodash';

/// toFixed doesn't work for all cases to round up numbers
/// https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
export const round = (number: number, decimals = 1): number => {
  const roundedNum =  Math.round(Number(`${number}e${decimals}`));
  return Number(
    Number(`${roundedNum}e-${decimals}`).toFixed(decimals)
  );
};

export const drawnDownStringer = (stocksWithHighestDrawndowns: IStockInformation[]): any => {
  let drawnDowns = [];
  _.each(stocksWithHighestDrawndowns, (stock: IStockInformation) => {
    const drawnDown = `-${stock.drawDown}% (${stock.highestPrice} on ${stock.date} -> ` +
      `${stock.lowestPrice} on ${stock.date})`;
    drawnDowns.push({drawnDown: drawnDown});
  });
  const stockWithHighestDD = stocksWithHighestDrawndowns[0];
  const maximumDrawndown = `Maximum drawdown: -${stockWithHighestDD.drawDown}% ` +
    `(${stockWithHighestDD.highestPrice} on ${stockWithHighestDD.date} -> ` +
    `${stockWithHighestDD.lowestPrice} on ${stockWithHighestDD.date})`;

  return {
    drawnDowns: drawnDowns,
    maximumDrawndown: maximumDrawndown
  };
};

export const stockPriceStringer = (stockInfo: IStockInformation[]): any => {
  let stockPrices = [];
  _.each(stockInfo, (dailyStockInfo: IStockInformation) => {
    const stockPrice = `${dailyStockInfo.date}: Closed at ${dailyStockInfo.closePrice} ` +
      `(${dailyStockInfo.lowestPrice} ~ ${dailyStockInfo.highestPrice})`;
    stockPrices.push({stockPrice: stockPrice});
  });

  return {
    stockPrices: stockPrices
  };
};

export const stockReturnStringer = (stockReturn: IStockReturn): string => {
  const returnRate = stockReturn.returnRate > 0 ?
    `+${stockReturn.returnRate}` : `${stockReturn.returnRate}`;
  const outputOfStockReturn =
    `Return: ${stockReturn.returnOfStock} [${returnRate}%] ` +
    `(${stockReturn.initialStockInfo.closePrice} on ${stockReturn.initialStockInfo.date} -> ` +
    `${stockReturn.lastStockInfo.closePrice} on ${stockReturn.lastStockInfo.date})\n`;

  return outputOfStockReturn;
};
