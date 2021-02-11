import { Pageable } from './pageable';
export class SurveyPageableRequest {
    // pageable:Pageable;
    direction: string;
    field: string;
    page:number;
    provinceName:string;
    size:number;
    surveyCode:string;
    surveyName:string;
}