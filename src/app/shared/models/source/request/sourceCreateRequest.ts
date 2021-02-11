import { ContactAddRequest } from './../../contact/request/contactaddrequest';
export class SourceCreateRequest{
    sourceName:string;
    taxId:string;
    address:string;
    provinceCode:string;
    amphurCode:string;
    tambolCode:string;
    provinceId:number;
    amphurId:number;
    tambolId:number;
    // postcode:string;
    // surveyCode:string;
    // contacts = Array<ContactAddRequest>();
}