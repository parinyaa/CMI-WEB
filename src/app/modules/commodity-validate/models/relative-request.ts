export class RelativeRequest {
  relativeStatus: string;
  monthTerm: number;
  yearTerm: number;
  baseYearId: number;
  cpaId: number;
  provinceId: number;
}

export class PeriodCurrent {
  month: number;
  year: number;
  yearId : number;
}

export class CancelPublishRequest {
  baseYearId: number;
  month: number;
  year: number;
  provinceId: number;
}
