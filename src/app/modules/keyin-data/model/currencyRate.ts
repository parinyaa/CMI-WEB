export interface CurrencyRate {
  currencyKey: CurrencyKey;
  transactionDate: string;
  exchangeRate: number;
}

export interface CurrencyKey {
  currencyUnit: CurrencyUnit;
  yearTerm: number;
  monthTerm: number;
}

export interface CurrencyUnit {
  paramInfoId: number;
  paramCode: string;
  paramEnDescription: string;
  paramLocalDescription: string;
  specialPurpose: null;
  sortingOrder: number | null;
  paramGroup: ParamGroup;
}

export interface ParamGroup {
  paramGroupId: number;
  paramGroup: string;
  paramEnDescription: string;
  paramLocalDescription: string;
}
