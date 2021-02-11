export class BasePrice {
  baseYear: number;
  baseYearId: number;
  yearTerm: number;
  monthTerm: number;
  cpaId: number;
  commodityCode: String;
  commodityName: String;
  price: number;
  startPeriod: String;
  endPeriod: String;
}

export class BasePriceResponse {
  page: number;
  size: number;
  totalPages: number;
  totalRecords: number;
  content: BasePrice[];
}

export class FilterBasePiceRequest {
  yearTerm: string;
  monthTerm: string;
  commodityCode: string;
  commodityName: string;
  notPrice: string;
  indexGroupId: number;
  regionId: number;
  provinceId: number;
}

export class CpaNewBasePrice {
  baseYear: number;
  cpaId: number;
  commodityCode: string;
  commodityName: string;
  price: number;
  cpaClone: any;
}

export class BasePriceRequest {
  indexGroup: number;
  provinceId: number;
  regionId: number;
  basePrice = new Array<BasePrice>();
}

export class CpaNewBasePriceRequest {
  provinceId: number;
  region: number;
  indexGroup: number;
  cpaIdNew: number;
  cpaIdClone: number;
}

export class CpaNewBasePriceRequestList {
  newBasePrice = new Array<CpaNewBasePriceRequest>();
}

export class BasePriceByCpaResponse {
  cpaId: number;
  yearTerm: number;
  monthTerm: number;
  commodityCode: String;
  commodityName: String;
  price: number;
}

export class StateAddNewCommodity {
  cpaNewBasePrice: CpaNewBasePrice;
  provinceId: number;
  regionId: number;
  indexGroup: number;
}

export class DialogAddBasePriceResponse {
  selectCpa : number;
  cpaClone: number;
  listImport = new Array();
}
