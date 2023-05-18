export interface Stock {
  dealDate: string;         // 成交日期
  dealStockNumber: number;  // 成交股數
  dealPrice: number;        // 成交金額
  openPrice: number;        // 開盤價
  highestPrice: number;     // 最高價
  lowestPrice: number;      // 最低價
  closePrice: number;       // 收盤價
  priceDifference: number;  // 漲跌價差
  dealNumber: number;       // 成交筆數
}
