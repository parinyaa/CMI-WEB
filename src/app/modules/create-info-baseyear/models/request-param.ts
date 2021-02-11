import { BaseCondition } from './../../../shared/models/conditionFilter/ConditionFilter';
export class RequestParam {
  params: Params;
  page: number;
  size: number;
  sortColumns: string[];
  sortOrders: string[];
  condition:any;
  avgBaseWeightReq: AvgBaseWeightReq;
}

export class Params {
  key: string;
  value: any;
}

export class AvgBaseWeightReq {
 provinceId: number;
 regionId: number;
 indexGroup: number;
}

export class IndexGroupRes {
  isDeleted: string;
  orderNo: number;
  paramEnMessage: string;
  paramId: number;
  paramInfo: string;
  paramLocalMessage:string;
  specialPurpose: number;
}

export class ProvinceRes {
  provinceCode: string;
  provinceId: number;
  provinceName: string;
}
