import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {
  InboxDetail,
  InboxDetails,
} from '../../../modules/commodity-validate/models/inbox-details';
import {CheckMonthYearRequest, ExportResultCommodityRequest, InquiryResultCommodityRequest} from 'src/app/shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import {
  CommodityCalculate,
  CalculateCommodityRequest,
} from '../../../modules/commodity-validate/models/commodity-calculate';
import {WeightAndIndexRequestForm, AutoCalRelativeRequest} from 'src/app/shared/models/dataenty/request/WeightAndIndexRequestForm';
import {PriceDataRequestForm} from '../../../shared/models/dataenty/request/PriceDataRequestForm';
import {CommemtSaveRequest} from '../../../shared/models/datadaily/CommentSaveRequest';
import {
  Compare,
  Inbox,
  GetValidateDataInboxRequest,
} from '../../../modules/commodity-validate/models/inbox';
import {Category} from '../../../modules/commodity-validate/models/category';
import {
  RelativeRequest,
  CancelPublishRequest,
} from '../../../modules/commodity-validate/models/relative-request';
import {RelativeStatusResponse} from '../../../modules/commodity-validate/models/relative-status-reponse';
import {CompareCountRequest} from '../../../modules/commodity-validate/models/compare-count-request';
import {ViewRelative} from '../../../modules/result-commodity/model/view-relative';
import {ViewWeight} from '../../../modules/result-commodity/model/view-weight';
import {ViewIndex} from '../../../modules/result-commodity/model/view-index';
import { YearTermRequestModel } from 'src/app/modules/result-commodity/model/YearTermRequestModel';

const endpoint = environment.services.commodity.endpoint.validate;
const endpointExport = environment.services.export.endpoint.includeResultCommodity;

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json;charset=UTF-8',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CommodityService {
  constructor(private http: HttpClient) {}

  public getCategory(): Observable<Category[]> {
    const url = endpoint.category;
    return this.http
      .get<Category[]>(url, httpOptions)
      .pipe(tap((_) => console.log('getCategory success')));
  }

  public getInbox(index: GetValidateDataInboxRequest): Observable<Inbox[]> {
    const url = endpoint.inbox;
    return this.http
      .post<Inbox[]>(url, index, httpOptions)
      .pipe(tap((_) => console.log('getInbox success')));
  }

  public getCompareCount(
    type: string,
    param: CompareCountRequest,
  ): Observable<Compare[]> {
    const url = endpoint.compareCount + '/' + type;
    return this.http
      .post<Compare[]>(url, param, httpOptions)
      .pipe(tap((_) => console.log('getCompareCount success')));
  }

  public getInboxDetail(
    index: string,
    stateMonth: string,
    data: PriceDataRequestForm,
  ): Observable<InboxDetails> {
    const url = endpoint.inboxDetail + '/' + index + '/' + stateMonth;
    return this.http
      .post<InboxDetails>(url, data, httpOptions)
      .pipe(tap((_) => console.log('getInboxDetail success')));
  }

  public calculateCommodity(
    request: CalculateCommodityRequest,
  ): Observable<Array<CommodityCalculate>> {
    const url = endpoint.calculatedCommodity;
    return this.http
      .post<Array<CommodityCalculate>>(url, request, httpOptions)
      .pipe(tap((_) => console.log('calculateCommodity success')));
  }

  public saveCommodity(
    allSelected: InboxDetail[],
  ): Observable<CommodityCalculate> {
    const url = endpoint.saveCommodity;
    return this.http
      .post<CommodityCalculate>(url, allSelected, httpOptions)
      .pipe(tap((_) => console.log('calculateCommodity success')));
  }

  public inquiryResultCommodity(
    body: InquiryResultCommodityRequest,
  ): Observable<any> {
    const url = environment.services.commodity.endpoint.result.data;
    return this.http
      .post<any>(url, body, httpOptions)
      .pipe(tap((_) => console.log('inquiryResultCommodity success')));
  }
  public inquiryRelative(
    body: InquiryResultCommodityRequest,
  ): Observable<ViewRelative[]> {
    const url = environment.services.commodity.endpoint.result.relative;
    return this.http
      .post<ViewRelative[]>(url, body, httpOptions)
      .pipe(tap((_) => console.log('inquiryRelative success')));
  }
  public inquiryWeight(
    body: InquiryResultCommodityRequest,
  ): Observable<ViewWeight[]> {
    const url = environment.services.commodity.endpoint.result.cpaResultWeight;
    return this.http
      .post<ViewWeight[]>(url, body, httpOptions)
      .pipe(tap((_) => console.log('inquiryWeight success')));
  }
  public inquiryIndex(
    body: InquiryResultCommodityRequest,
  ): Observable<ViewIndex[]> {
    const url = environment.services.commodity.endpoint.result.index;
    return this.http
      .post<ViewIndex[]>(url, body, httpOptions)
      .pipe(tap((_) => console.log('inquiryWeight success')));
  }

  public inquirySopWeight(
    body: InquiryResultCommodityRequest,
  ): Observable<ViewWeight[]> {
    const url = environment.services.commodity.endpoint.result.sopResultWeight;
    return this.http
      .post<ViewWeight[]>(url, body, httpOptions)
      .pipe(tap((_) => console.log('inquirySopWeight success')));
  }
  public inquirySopIndex(
    body: InquiryResultCommodityRequest,
  ): Observable<ViewIndex[]> {
    const url = environment.services.commodity.endpoint.result.sopIndex;
    return this.http
      .post<ViewIndex[]>(url, body, httpOptions)
      .pipe(tap((_) => console.log('inquirySopIndex success')));
  }

  public inquiryYearFromPriceData(): Observable<any> {
    const url = environment.services.commodity.endpoint.result.year;
    return this.http
      .get<any>(url, httpOptions)
      .pipe(tap((_) => console.log('inquiryYearFromPriceData success')));
  }

  public inquiryYearFromPriceDataById(id): Observable<any> {
    const url = environment.services.commodity.endpoint.result.year + '/' + id;
    return this.http
      .get<any>(url, httpOptions)
      .pipe(tap((_) => console.log('inquiryYearFromPriceDataById success')));
  }

  public inquiryYearTermIndex(req: YearTermRequestModel, ): Observable<any> {
    const url = environment.services.commodity.endpoint.result.yearTermIndex;
    return this.http
      .post(url, req, httpOptions)
      .pipe(tap((_) => console.log('inquiryYearFromPriceDataByIdIndex success')));
  }

  
  public inquiryYearTermWeight(req: YearTermRequestModel, ): Observable<any> {
    const url = environment.services.commodity.endpoint.result.yearTermWeight;
    return this.http
      .post(url, req, httpOptions)
      .pipe(tap((_) => console.log('inquiryYearFromPriceDataByIdWeight success')));
  }

  public canCalculateWeightAndIndex(
    calculateWeightAndIndexRequestForm: WeightAndIndexRequestForm,
  ): Observable<RelativeStatusResponse> {
    const url = endpoint.canCalculateWeightAndIndex;
    return this.http
      .post<RelativeStatusResponse>(
        url,
        calculateWeightAndIndexRequestForm,
        httpOptions,
      )
      .pipe(tap((_) => console.log('canCalculateWeightAndIndex')));
  }

  public calculateWeightAndIndex(
    calculateWeightAndIndexRequestForm: WeightAndIndexRequestForm,
  ): Observable<any> {
    const url = endpoint.calculatedWeightAndIndex;
    return this.http
      .post(url, calculateWeightAndIndexRequestForm, httpOptions)
      .pipe(tap((_) => console.log('calculateWeightAndIndex')));
  }

  public saveComment(comment: CommemtSaveRequest): Observable<any> {
    const url = endpoint.saveComment;
    return this.http
      .post(url, comment, httpOptions)
      .pipe(tap((_) => console.log('saveComment')));
  }

  public updateRelativeStatus(
    relativeRequest: RelativeRequest,
  ): Observable<any> {
    const url = endpoint.updateRelative;
    return this.http
      .post(url, relativeRequest, httpOptions)
      .pipe(tap((_) => console.log('updateRelativeStatus')));
  }

  public publishIndex(relativeRequest: RelativeRequest): Observable<any> {
    const url = endpoint.publishIndex;
    return this.http
      .post(url, relativeRequest, httpOptions)
      .pipe(tap((_) => console.log('publishIndex')));
  }

  public cancelPublish(request: CancelPublishRequest): Observable<any> {
    const url = endpoint.cancelPublish;
    return this.http
      .post(url, request, httpOptions)
      .pipe(tap((_) => console.log('cancelPublish')));
  }

  public createSOP(): Observable<any> {
    const url = endpoint.createSOP;
    return this.http
      .post(url, null, httpOptions)
      .pipe(tap((_) => console.log('createSOP')));
  }

  public cancelCalculate(request: CancelPublishRequest): Observable<any> {
    const url = endpoint.cancelCalculate;
    return this.http
      .post(url, request, httpOptions)
      .pipe(tap((_) => console.log('cancelCalculate')));
  }
  // public inquiryRelative(
  //   body: InquiryResultCommodityRequest,
  // ): Observable<ViewRelative[]> {
  //   const url = environment.services.commodity.endpoint.result.relative;
  //   return this.http
  //     .post<ViewRelative[]>(url, body, httpOptions)
  //     .pipe(tap((_) => console.log('inquiryRelative success')));
  // }

  public validateMonthYear( body: CheckMonthYearRequest,): Observable<any> {
    const url = environment.services.commodity.endpoint.result.validataMonthYear;
    return this.http
      .post<any>(url, body, httpOptions)
      .pipe(tap((_) => console.log('validateMonthYear success')));
  }

  exportResultCommodity(
    baseyear: number,
    yearterm: number,
    monthterm: number,
  ): Observable<any> {
    const url =
      environment.services.commodity.endpoint.result.export +
      '/' +
      baseyear +
      '/' +
      yearterm +
      '/' +
      monthterm;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(tap((_) => console.log('exportResultCommodity Success')));
  }

  exportIncludeCommodity(body: ExportResultCommodityRequest): Observable<any> {
    const url = endpointExport;
    return this.http.post(url, body,
        {responseType:'blob'}
        )
      .pipe(tap((_) => console.log('exportIncludeCommodity Success')));
  }

  exportRelativeCommodity(
    baseyear: number,
    yearterm: number,
    monthterm: number,
    provinceId: number,
    commodityCode: string,
  ): Observable<any> {
    const url =
      environment.services.commodity.endpoint.result.exportRelative +
      '/' +
      baseyear +
      '/' +
      yearterm +
      '/' +
      monthterm +
      '/' +
      provinceId +
      '/' +
      commodityCode
      ;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(tap((_) => console.log('exportRelativeCommodity Success')));
  }
  exportIndexCommodity(
    baseyear: number,
    yearterm: number,
    monthterm: number,
    provinceId: number,
    commodityCode: string
  ): Observable<any> {
    const url =
      environment.services.commodity.endpoint.result.exportIndex +
      '/' +
      baseyear +
      '/' +
      yearterm +
      '/' +
      monthterm +
      '/' +
      provinceId + 
      '/' +
      commodityCode;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(tap((_) => console.log('exportIndexCommodity Success')));
  }

  exportWeightCommodity(
    baseyear: number,
    yearterm: number,
    monthterm: number,
    provinceId: number,
  ): Observable<any> {
    const url =
      environment.services.commodity.endpoint.result.exportCpaWeight +
      '/' +
      baseyear +
      '/' +
      yearterm +
      '/' +
      monthterm +
      '/' +
      provinceId;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(tap((_) => console.log('exportWeightCommodity Success')));
  }

  exportSopIndexCommodity(
    baseyear: number,
    yearterm: number,
    monthterm: number,
  ): Observable<any> {
    const url =
      environment.services.commodity.endpoint.result.exportSopIndex +
      '/' +
      baseyear +
      '/' +
      yearterm +
      '/' +
      monthterm;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(tap((_) => console.log('exportSopIndexCommodity Success')));
  }

  exportSopWeightCommodity(
    baseyear: number,
    yearterm: number,
    monthterm: number,
  ): Observable<any> {
    const url =
      environment.services.commodity.endpoint.result.exportSopWeight +
      '/' +
      baseyear +
      '/' +
      yearterm +
      '/' +
      monthterm;
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(tap((_) => console.log('exportSopWeightCommodity Success')));
  }

  public filterInbox(commodity: string): Observable<Inbox[]> {
    const url = endpoint.filterinboxDetail + '/' + commodity;
    return this.http
      .get<Inbox[]>(url, httpOptions)
      .pipe(tap((_) => console.log('filterInbox success')));
  }

  public autoCalRelative(
    request: AutoCalRelativeRequest,
  ): Observable<any> {
    const url = endpoint.autoCalRelative;
    return this.http
      .post(url, request, httpOptions)
      .pipe(tap((_) => console.log('autoCalRelative')));
  }
}
