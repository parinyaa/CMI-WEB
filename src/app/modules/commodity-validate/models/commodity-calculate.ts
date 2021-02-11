export class CommodityCalculate {
  month: string;
  cvCurrentPrice: number;
  afAverageCurrentPrice: number;
  afAverageComparePrice: number;
  afAverageRelativePrice: number;
  gmAverageCurrentPrice: number;
  gmAverageComparePrice: number;
  gmAverageRelativePrice: number;
}

export class CalculateCommodityRequest {
  inboxDetails = new Array();
  mode: string;
  index: string;
  month: number;
  year: number;
  baseYearId: number;
  provinceId: number;
}
