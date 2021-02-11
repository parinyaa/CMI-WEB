export class Inbox {
  parentCpaId: number;
  parentCommodityCode: string;
  parentCommodityThName: string;
  priceDataStatus: null;
  requestCommentFlag: string;
  answerCommentFlag: string;
  commentFlag: string;
  updatedBy: string;
  commentNote: null;
  relativeStatus: string;
  countPlus: number;
  countMinus: number;
  items: number;
  cpaId: number;
  baseYearId: number;
  monthTerm: number;
  yearTerm: number;
  avgArCurrentPrice: null;
  avgArPreviousAdjustPrice: null;
  avgArRelative: null;
  avgGmCurrentPrice: null;
  avgGmPreviousAdjustPrice: null;
  avgGmRelative: null;
  indexGroup: number;
}

export class Compare {
  commodityCode: string;
  commodityThName: string;
  sourceName: string;
  sourceCode: string;
  dataMatrixId: number;
  cpaId: number;
  frequency: string;
}

export class GetValidateDataInboxRequest {
  index: string;
  month: number;
  year: number;
  provinceId: number;
  commodityCode: string;
  commodityName: string;
}
