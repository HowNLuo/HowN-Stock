export interface HistoricalStocks {
  title: string;
  data: string[][];
}

export interface HistoricalStock {
  dealDate: string;         // 成交日期
  dealStockNumber: string;  // 成交股數
  dealPrice: string;        // 成交金額
  openPrice: string;        // 開盤價
  highestPrice: string;     // 最高價
  lowestPrice: string;      // 最低價
  closePrice: string;       // 收盤價
  priceDifference: string;  // 漲跌價差
  dealNumber: string;       // 成交筆數
}
