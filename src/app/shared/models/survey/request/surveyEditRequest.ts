import { ContactAddRequest } from './../../contact/request/contactaddrequest';
import { ContactEditRequest } from '../../contact/request/contactEditRequest';

export class SurveyEditRequest{
    address: string;
    amphurCode: string;
    postCode:string;
    provinceCode:string;
    surveyCode: string;
    surveyName: string;
    tambolCode: string;
    taxId: string;
    contacts = Array<ContactEditRequest>();
    contactsAdd = Array<ContactAddRequest>();
}