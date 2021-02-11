export class DataMatrixCreateRequest {
    dataMatrix = new Array<DataMatrixList>();
}

export class DataMatrixList {
    dataConfig:number;
    userType:number;
    province:number;
}