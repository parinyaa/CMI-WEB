export class CpipMsIndexMatrixRequestForm {
  indexMatrixId: number = null;
  indexGroupId: number = null;
  regionId: number = null;
  provinceId: number = null;
}

export class IndexCpipResponseModel {
  indexGroup: IndexGroupResponseModel;
  province: ProvinceResponseModel;
  region: RegionResponseMode;

}

export class IndexGroupResponseModel {
  isDeleted: string;
  orderNo: number;
  paramEnMessage:string;
  paramId: number;
  paramInfo: string;
  paramLocalMessage: string;
  specialPurpose: string;
}
export class RegionResponseMode {
  percent: number;
  regionCode: string;
  regionId: number;
  regionName: string;
  regionNameEn: string;

}
export class ProvinceResponseModel {
  provinceCode: string
  provinceId: number
  provinceName: string

}

export class DisabledModel {
  checkdDisableProvince: boolean;
  searchActive: boolean = false;
}
