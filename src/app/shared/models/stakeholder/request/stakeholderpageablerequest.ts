import { Pageable } from './pageable';
export class StakeholderPageableRequest {
    // pageable:Pageable;
    direction: string;
    field: string;
    page:number;
    provinceName:string;
    size:number;
    stakeholderCode:string;
    stakeholderName:string;
}