import { Params } from './../../../modules/create-info-baseyear/models/request-param';
export class ConditionFilter {
    baseYear:boolean;
    yearTerm:boolean;
    monthTerm:boolean;
    commodityCode:boolean;
    commodityName:boolean;
    btnSearch:boolean;
}

export class Condition {
    baseYear:string;
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;;
    commodityName:string;
}

export class ConditionGetAvgBaseWeight{
    baseYear:string;
    commodityCode:string;;
    commodityName:string;
}

export class ConfitionGetBasePrice{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;;
    commodityName:string;
}

export class RequestParam {
    params: Params;
    page: number;
    size: number;
    sortColumns: string[];
    sortOrders: string[];
    condition:BaseCondition<ConditionGetAvgBaseWeight>
  }

  export class BaseCondition<T>{

  }

  export class ConditonGetBaseWeight{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;;
    commodityName:string;
  }
  
  export class ConditionGetBaseIndex{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetAvgBaseIndex{
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetRebaseIndex{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetCapWeight{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetCapIndex{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetSopAvgWeight{
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetSopWeight{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetSopIndex{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetSopAvgIndex{
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetSoRebaseIndex{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetTrSopWeight{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }

  export class ConditionGetTrSopIndex{
    yearTerm:string;
    monthTerm:string;
    commodityCode:string;
    commodityName:string;
  }
  

