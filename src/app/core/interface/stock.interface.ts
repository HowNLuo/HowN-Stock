export interface HistoricalStocks {
  msg: string;
  status: number;
  data: HistoricalStock[];
}

export interface HistoricalStock {
  date: string;             // 成交日期
  stock_id: string;         // 股票代號
  Trading_Volume: number;   // 成交量
  Trading_money: number;    // 成交金額
  open: number;             // 開盤價
  max: number;              // 最高價
  min: number;              // 最低價
  close: number;            // 收盤價
  spread: number;           // 買賣價差
  Trading_turnover: number; // 交易筆數
}

export interface StockInfo {
  msg: string;
  status: number;
  data: {
    industry_category: string;
    stock_id: string;
    stock_name: string;
    type: string;
    date: string;
  }[]
}
