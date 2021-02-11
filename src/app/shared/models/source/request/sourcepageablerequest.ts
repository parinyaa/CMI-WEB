import { Pageable } from './../../survey/request/pageable';
export class SourcePageableRequest {
    pageable:Pageable;
    // surveyCode:string;
    sourceCode:string;
    direction: string;
    field: string;
    page:number;
    provinceName:string;
    size:number;
    sourceName:string;
    amphurName: string;
}