import { ParamInfo } from 'src/app/modules/master-params/model/param';

export class InquireRegionStep {
    baseYearId: number;
    indexGroup: number;
}

export class UpdateRegionProportionRequest {
    baseYearId: number;
    indexGroup: number;
    region0: number;
    region1: number;
    region2: number;
    region3: number;
    region4: number;
}
export class ParamRequest {
    baseYearId: number;
    indexGroup: number
    regionId: number;
}

export class RegionStepResponse {
    region = new Array<InquiryRegionStepResponse>();
    cpipTrWeight: cpipTrWeight;
}

export class InquiryRegionStepResponse {
    regionId: number;
    regionName: string;
    stepNo: number;
    proportion: number;
}

export class cpipTrWeight {
    weightId: number;
    baseYear: number;
    indexGroup: ParamInfo;
    region: any;
    region0: number;
    region1: number;
    region2: number;
    region3: number;
    region4: number;
    stepNo: number;
}

export class CallStageRequest {
    baseYearId: number;
    indexGroup: number
    regionId: number;
}