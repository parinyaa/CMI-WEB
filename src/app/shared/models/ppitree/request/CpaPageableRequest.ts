export class CpaPageableRequset {
    page:number
    pageSize:number;
    field:string;
    direction:string = "ASC"
    commodityCode:string = "";
    commodityName:string = "";
    searchType:number;
    provinceName:String = "";
    provinceId: number = 1;
}