export class ResponseApi<T> {
    code: string;
    message: string;
    data: T;
}


export class PageableResponse {
    page: number;
    size: number;
    totalRecords: number;
    content = new Array<any>();
}