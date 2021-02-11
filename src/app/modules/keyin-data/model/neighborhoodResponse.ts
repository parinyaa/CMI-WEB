export class NeighborhoodResponse {
  content: Content[];
  pageable: Pageable;
  totalPages: number;
  last: boolean;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export class Content {
  checked: boolean;
  baseYearId: number;
  yearTerm: number;
  monthTerm: number;
  dataMatrixId: number;
  baseYear: BaseYear;
  dataMatrix: DataMatrix;
  cpa: CPA;
  usedFlag: string;
  frequency: CurrencyUnit;
  previousPrice: number;
  previousAdjustedPrice: number;
  price1: null;
  price2: null;
  price3: null;
  price4: null;
  price5: null;
  price6: null;
  price7: null;
  price8: null;
  price9: null;
  price10: null;
  price11: null;
  price12: null;
  price13: null;
  price14: null;
  price15: null;
  price16: null;
  price17: null;
  price18: null;
  price19: null;
  price20: null;
  price21: null;
  price22: null;
  price23: null;
  price24: null;
  price25: null;
  price26: null;
  price27: null;
  price28: null;
  price29: null;
  price30: null;
  price31: null;
  currentPrice: number;
  currentAdjustedPrice: number;
  calculatedPrice: number;
  currencyRate: number;
  currentCalculatedPrice: number;
  previousCalculatedPrice: number;
  currencyUnit: CurrencyUnit;
  noOfCarrierForward: number;
  imputationFlag: null;
  relativeRatio: null;
  rel: number;
  link: CurrencyUnit;
  remark: null;
  requestCommentFlag: string;
  answerCommentFlag: string;
  commentNote: null;
  status: string;
}

export class BaseYear {
  baseYearId: number;
  baseYear: number;
  status: string;
}

export class CPA {
  cpaId: number;
  commodityCode: string;
  commodityThName: string;
  commodityEnName: string;
  commodityLevel: number;
  parentId: CPAParentId;
  noOfCarrierForward: number;
  pricePercentageChange: number;
  frequency: CurrencyUnit;
  measureUnit: CurrencyUnit;
  currencyUnit: CurrencyUnit;
}

export class CurrencyUnit {
  paramInfoId: number;
  paramCode: string;
  paramEnDescription: string;
  paramLocalDescription: string;
  specialPurpose: null;
  sortingOrder: number | null;
  paramGroup: ParamGroupClass;
}

export class ParamGroupClass {
  paramGroupId: number;
  paramGroup: string;
  paramEnDescription: string;
  paramLocalDescription: string;
}

export class CPAParentId {
  cpaId: number;
  commodityCode: string;
  commodityThName: string;
  commodityEnName: string;
  commodityLevel: number;
  parentId: PurpleParentId;
  noOfCarrierForward: null;
  pricePercentageChange: null;
  frequency: null;
  measureUnit: null;
  currencyUnit: null;
}


export class PurpleParentId {
  cpaId: number;
  commodityCode: string;
  commodityThName: string;
  commodityEnName: string;
  commodityLevel: number;
  parentId: FluffyParentId;
  noOfCarrierForward: null;
  pricePercentageChange: null;
  frequency: null;
  measureUnit: null;
  currencyUnit: null;
}


export class FluffyParentId {
  cpaId: number;
  commodityCode: string;
  commodityThName: string;
  commodityEnName: string;
  commodityLevel: number;
  parentId: TentacledParentId;
  noOfCarrierForward: null;
  pricePercentageChange: null;
  frequency: null;
  measureUnit: null;
  currencyUnit: null;
}


export class TentacledParentId {
  cpaId: number;
  commodityCode: string;
  commodityThName: string;
  commodityEnName: string;
  commodityLevel: number;
  parentId: PPIMSCPA;
  noOfCarrierForward: null;
  pricePercentageChange: null;
  frequency: null;
  measureUnit: null;
  currencyUnit: null;
}


export class PPIMSCPA {
  cpaId: number;
  commodityCode: string;
  commodityThName: string;
  commodityEnName: string;
  commodityLevel: number;
  parentId: PPIMSCPA | null;
  noOfCarrierForward: number | null;
  pricePercentageChange: number | null;
  frequency: CurrencyUnit | null;
  measureUnit: CurrencyUnit | null;
  currencyUnit: CurrencyUnit | null;
}

export class DataMatrix {
  dataMatrixId: number;
  dataConfig: DataConfig;
  userType: CurrencyUnit;
  province: Province;
}

export class DataConfig {
  dataConfigId: number;
  ppiMSCPA: PPIMSCPA;
  ppiMSSource: PPIMSSource;
}

export class PPIMSSource {
  sourceId: number;
  sourceName: string;
  sourceCode: string;
  survey: Survey;
  taxId: string;
  address: string;
  tambol: Tambol;
  amphur: Amphur;
  province: Province;
  postcode: string;
}

export class Amphur {
  amphurId: number;
  amphurCode: string;
  amphurName: string;
  cpipMSProvince: Province;
}


export class Province {
  provinceId: number;
  provinceCode: string;
  provinceName: string;
  cpipMsRegion: PPIMSRegion;
}

export class PPIMSRegion {
  regionId: number;
  regionCode: string;
  regionName: string;
}


export class Survey {
  surveyId: number;
  surveyName: string;
  surveyCode: string;
  taxId: string;
  address: string;
  cpipMSTambol: Tambol;
  cpipMSAmphur: Amphur;
  cpipMSProvince: Province;
  postcode: string;
}

export class Tambol {
  tambolId: number;
  tambolCode: string;
  tambolName: string;
  postcode: string;
  cpipMSAmphur: Amphur;
}


export class Pageable {
  sort: Sort;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export class Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
