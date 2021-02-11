export class WeightAndIndexRequestForm {
  commodityCode: string;
  monthTerm: number;
  yearTerm: number;
  provinceId: number;
  baseYearId: number;
  indexGroup: number;
}


export class AutoCalRelativeRequest {
  monthTerm: number;
  yearTerm: number;
  provinceId: number;
  cpipId : number
}