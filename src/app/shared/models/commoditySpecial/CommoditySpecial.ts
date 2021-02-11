export class CommoditySpecialModel {
    cpipId: number;
    commodityCode: string;
    commodityThName: string;
}

export class CommodityNotInSpecialRequest {
    cpipId: number;
    keyword: string;
}

export class UpdateCommoditySpacialMappingRequest {
    cpipId: number;
    action: string;
    cpipIdUpdate = new Array<number>();
}