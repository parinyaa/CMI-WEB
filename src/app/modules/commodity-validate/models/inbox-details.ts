export class InboxDetails {
  inboxDetails: InboxDetail[];
  totalCurrentPrice: number;
  totalPrevPrice: number;
}

export class InboxDetail {
  checked: boolean;
  neighborHoodChecked: boolean;
  parentCpaId: number;
  parentCommodityCode: string;
  parentCommodityThName: string;
  sourceName: string;
  surveyName: string;
  frequency: string;
  price1: number;
  price2: number;
  price3: number;
  price4: number;
  previousPrice: number;
  previousAdjustedPrice: number;
  previousCalculatedPrice: number;
  currentPrice: number;
  link: number;
  impute: number;
  disabledImpute: boolean;
  currencyUnit: number;
  hasCurrencyRate: boolean;
  currencyRate: number;
  currentCalculatedPrice: number;
  currentAdjustedPrice: number;
  noOfCarrierForward: number;
  noOfCarrierForwardLimit: number;
  rel: number;
  relativeRatio: number;
  remark: string;
  requestCommentFlag: string;
  answerCommentFlag: string;
  commentNote: string;
  commentFlag: string;
  updatedBy: string;
  usedFlag: string;
  priceFlag: string;
  priceFlagChecked: boolean;
  baseYearIdPk: number;
  monthTermPk: number;
  yearTermPk: number;
  cpaIdPk: number;
  dataMatrixIdPk: number;
  previousCurrencyRate: number;
  currentCurrencyRate: number;
  isCurrentAdjustedPriceReadOnly: boolean;
  isPreviousAdjustedPriceReadOnly: boolean;
  sourceCode: string;
  isUpdate: boolean;
}

export class AddPriceDataRequest {
  inboxDetails = new Array<InboxDetail>();
  monthTerm: number;
  yearTerm: number;
}

export class ListGroupCpipRequest {
  frequency: string;
  provinceId: number;
  yearTerm: number;
  monthTerm: number;
}
