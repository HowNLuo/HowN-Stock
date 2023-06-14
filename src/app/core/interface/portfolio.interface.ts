export class PortfolioReq {
  stockId: string;
  stockName: string;
  category: string[];
}

export class PortfolioRes {
  portfolio: Portfolio[];
}

export class Portfolio {
  stockId: string;
  stockName: string;
  category: string;
  id: string;
}

export class CategoryReq {
  categoryName: string;
}

export class CategoryRes {
  category: Category[];
}

export class Category {
  categoryName: string;
  id: string;
}
