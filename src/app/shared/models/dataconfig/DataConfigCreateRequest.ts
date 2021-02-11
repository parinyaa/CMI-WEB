import { DataConfigListRequest } from "./DataConfigListRequest";

export class DataConfigCreateRequest {
    dataConfig =  Array<DataConfigListRequest>();
}

export class FilterCpaMinusSource{
     sourceId:number;
    filterCode:string;
    filterName:string;
}

export class FilterCpaMinus{
    
    cpaId:number;
    sourceCode:string;
    sourceName:string;
    // surveyCode:string;
    // surveyName:string;
    provinceId: number;
}

export class CpipMsDadaConfigRequest {
    provinceId: number;
    sourceId: number;
}

export class ExportSourceByCpaRequest {
    provinceId: number;
    cpaId:number;
}
