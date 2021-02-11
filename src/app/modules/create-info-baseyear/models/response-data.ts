export class ResponseData<T> {
  data: T[];
  pageNumber: number;
  totalPage: number;
  dataSize: number;
  pageSize: number;
}

export class AvgBaseWeight {
  baseYearId: number;
  baseYear: number;
  cpaId: number;
  commodityLevel: number;
  commodityName: string;
  commodityCode: string;
  averageWeight: number;
  averagePrice: null;
  parentCpaId: number;
  parentCommodityCode: string;
  parentCommodityName: string;
}

export class BasePrice {
  commodityName: string;
  commodityCode: string;
  yearTerm: number;
  cpaId: number;
  price: number;
  baseYearId: number;
  monthTerm: number;
  mom: number;
}

export class BaseWeight {
  commodityName: string;
  commodityCode: string;
  yearTerm: number;
  monthTerm: number;
  weight: number;
  commodityLevel: number;
}

export class BaseIndex {
  index: number;
  commodityName: string;
  commodityCode: string;
  yearTerm: number;
  monthTerm: number;
  commodityLevel: number;
}

export class RebaseIndex {
  index: number;
  commodityName: string;
  commodityCode: string;
  yearTerm: number;
  monthTerm: number;
  baseIndex: number;
  baseYoy: number;
  yoy: number;
  baseMom: number;
  mom: number;
  aoa: number;
  commodityLevel: number;
  baseAoa: number;
}

export class CpaIndex {
  index: number;
  commodityName: string;
  commodityCode: string;
  yearTerm: number;
  monthTerm: number;
  baseIndex: number;
  baseYoy: number;
  yoy: number;
  baseMom: number;
  mom: number;
  aoa: number;
  commodityLevel: number;
  baseAoa: number;
}

export class CpaWeight {
  commodityName: string;
  commodityCode: string;
  yearTerm: number;
  monthTerm: number;
  mom: number;
  weight: number;
  commodityLevel: number;
}

export class SopAvgWeight {
  baseYear: number;
  baseYearId: number;
  commodityCode: string;
  commodityLevel: number;
  commodityThName: string;
  averageWeight: number;
}

export interface SopWeight {
  monthTerm: number;
  baseYearId: number;
  yearTerm: number;
  commodityCode: string;
  commodityLevel: number;
  commodityThName: string;
  weight: number;
}

export class SopIndex {
  monthTerm: number;
  baseYearId: number;
  yearTerm: number;
  commodityCode: string;
  commodityLevel: number;
  commodityThName: string;
  indexValue: number;
  yoy: number;
  mom: number;
  aoa: number;
}

export class SopAvgIndex {
  baseYear: number;
  baseYearId: number;
  commodityCode: string;
  commodityLevel: number;
  commodityThName: string;
  averageIndex: number;
}

export class TrSopWeight {
  monthTerm: number;
  yearTerm: number;
  commodityCode: string;
  commodityName: string;
  commodityLevel: number;
  mom: number;
  weight: number;
}

export class TrSopIndex {
  index: number;
  monthTerm: number;
  yearTerm: number;
  commodityCode: string;
  commodityName: string;
  commodityLevel: number;
  baseIndex: null;
  baseYoy: null;
  yoy: null;
  aoa: null;
  baseMom: null;
  mom: null;
  baseAoa: null;
}

export class AvgPbar {
  baseYearId: number;
  baseYear: number;
  cpaId: number;
  commodityLevel: number;
  commodityName: string;
  commodityCode: string;
  averageWeight: number;
  averagePrice: number;
  parentCpaId: number;
  parentCommodityCode: string;
  parentCommodityName: string;
}

export class AvgBaseIndex{
  baseYear:number;
  commoditiyCode:string;
  commodityName:string;
  commodityLevel:number;
  averageIndex:number;
}
