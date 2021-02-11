export class PriceData {
  baseYearId: number;
  dataMatrixId: number;
  monthTerm: number;
  yearTerm: number;
  imputationFlag: number;
  answerCommentFlag: string;
  currentCalculatedPrice: number;
  previousCalculatedPrice: number;
  commentNote: string;
  currencyRate: number;
  currencyUnit: number;
  currentAdjustedPrice: number;
  currentPrice: number;
  link: number;
  noOfCarrierForward: number;
  previousAdjustedPrice: number;
  previousPrice: number;
  relativeRatio: number;
  remark: string;
  requestCommentFlag: string;
  usedFlag: string;
  price1: number;
  price2: number;
  price3: number;
  price4: number;
  rel: number;
  priceFlag: string;
  previousCurrencyRate: number;
  currentCurrencyRate: number;
}


export class GroupList {
  groupCode: string;
  groupName: string;
}