import { ContactEditRequest } from '../../contact/request/contactEditRequest';

export class SourceEditRequest {
    address: string;
    sourceId: number;
    sourceName: string;
    taxId: string;
    contacts = Array<ContactEditRequest>();
}