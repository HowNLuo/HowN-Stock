export class ShareholdingRes {
  shareholding: Shareholding[];
}

export class Shareholding {
  stockId: string;       // 股票代號
  date: string;          // 交易日期
  stockUnits: number;    // 股數
  dealPrice: number;     // 成交股價
}
