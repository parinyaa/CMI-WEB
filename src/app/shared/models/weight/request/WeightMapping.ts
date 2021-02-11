export class InquiryWeightMaoppingRequest {
  weightCode: string;
  weightDesc: string;
  commodityCode: string;
  commodityName: string;
}

export class UpdateWeightMappingRequest {
  weightCode: string;
  weightDesc: string;
  cpipId: number;
  commodityCode: string;
  weightMappingId: number;
}

export class DeletedWeightMappingRequest {
  weightMappingId: number;
}

export class inquiryWeightDestination {
  weightId: number;
  weightDataId: number;
  group: string;
  weightCode: string;
  weightName: string;
}
