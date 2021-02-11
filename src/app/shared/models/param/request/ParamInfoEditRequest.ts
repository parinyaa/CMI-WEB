import { ParamGroup } from 'src/app/shared/common/GetParam';
export class ParamInfoEditRequest {
    paramInfoId:any;
    paramCode: string;
    paramEnDesc:string;
    paramLocalDesc:string;
    specialPurpose:string;
    sortingOrder:number;
    isDeleted:string;
    paramGroupId:number;
    
}