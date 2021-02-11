import {DocumentFileRequest} from 'src/app/shared/models/document/request/DocumentFileRequest'

export class AddDocumentRequest {
    files = new Array<DocumentFileRequest>();
    originalUrl = new Array<String>();
    baseYear : number;
    description : string;
    processSeq : string;
}