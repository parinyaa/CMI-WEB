import { ContactAddRequest } from './../../contact/request/contactaddrequest';
export class SurveyAddRequest {
     surveyName:string;
     taxId:string;
     address:string;
     provinceCode:string;
     amphurCode:string;
     tambolCode:string;
     postCode:string;
     contacts = Array<ContactAddRequest>();
}
