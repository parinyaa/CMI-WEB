export class ParamGroup {
  paramGroup: string;
  paramLocalDescription: string;
  paramEnDescription: string;
  info: ParamInfo[];
}

export class ParamInfo {
  paramId: number;
  paramInfo: string;
  paramEnMessage: string;
  paramLocalMessage: string;
  specialPurpose: null | string;
  orderNo: number | null;
}
