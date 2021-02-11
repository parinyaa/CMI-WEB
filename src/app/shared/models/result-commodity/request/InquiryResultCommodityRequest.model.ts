export class InquiryResultCommodityRequest {
  baseYear: number;
  year: number;
  month: number;
  provinceId: number;
  commodityCode: string;
}

export class CheckMonthYearRequest {
  startYear :number;
  startMonth :number;
  endYear :number;
  endMonth :number;
}

export class ExportResultCommodityRequest {

  regionId: number;
  provinceId: number;
  baseYearId: number;
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  groupCpip: string;
  commodityCode: string;
  type: string;
  fileName: string;
}

export class DataToDialogExportResultCommodity {
  title: string;
  provinceId: number;
  baseYearId: number;
  year: number;
  month: number;
  commodityCode: string;
  type: string;
}
