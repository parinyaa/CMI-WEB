import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InsertWorkflowRequest } from 'src/app/shared/models/workflow/request/InsertWorkflowRequest.model';
import { EditWorkFlowRequest } from 'src/app/shared/models/workflow/request/EditWorkFlowRequest.model';
import { MakeDecisionRequest } from 'src/app/shared/models/workflow/request/MakeDecisionRequest.model';
import { InquiryWorkflowRequest } from 'src/app/shared/models/workflow/request/InquiryWorkflowRequest.model';

const endpoint = environment.services.workflow.endpoint.workflow;
let httpOptions = {};

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(
    private http: HttpClient
  ) {
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })
    }
  }

  findAllDecision(workflowId, page, size): Observable<any> {
    let url = endpoint + '/findAllDecision/' + workflowId + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findAllDecision Success"))
    )
  }


  findAllWorkflow(workflowId, page, size): Observable<any> {
    let url = endpoint + '/findAllWorkflow/' + workflowId + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findAllWorkflow Success"))
    )
  }

  findWorkFlowCreateOrReply(workflowId, page, size): Observable<any> {
    let url = endpoint + '/findWorkFlowCreateOrReply/' + workflowId + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findWorkFlowCreateOrReply Success"))
    )
  }

  
  insertWorkflow(body: InsertWorkflowRequest): Observable<any> {
    let url = endpoint + '/create';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("insertWorkflow Success"))
    )
  }

  editWorkflow(body: EditWorkFlowRequest): Observable<any> {
    let url = endpoint + '/updateWorkFlow';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("editWorkflow Success"))
    );
  }

  deleteWorkflow(id): Observable<any> {
    let url = endpoint + '/deleted/' + id;
    return this.http.delete(url, httpOptions).pipe(
      tap(_ => console.log("deleteWorkflow Success"))
    )
  }

  makeDecisionWorkflow(body: MakeDecisionRequest): Observable<any> {
    let url = endpoint + '/updateStatus';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("makeDecisionWorkflow Success"))
    )
  }

  findDistinctCreateByNotSelf(workflowId): Observable<any> {
    let url = endpoint + '/findDistinctCreateByNotSelf/' + workflowId;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findDistinctCreateByNotSelf Success"))
    )
  }

  findDistinctCreateByAll(workflowId): Observable<any> {
    let url = endpoint + '/findDistinctCreateByAll/' + workflowId;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findDistinctCreateByAll Success"))
    )
  }

  inquiryWorkflow(body: InquiryWorkflowRequest): Observable<any> {
    let url = endpoint + '/inquiryWorkflow';
    return this.http.post(url, body, httpOptions).pipe(
      tap(_ => console.log("inquiryWorkflow Success"))
    )
  }

  findAllWorkflowAndDesicion(workflowId, page, size): Observable<any> {
    let url = endpoint + '/findAllWorkflowAndDecision/' + workflowId + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findAllWorkflowAndDesicion Success"))
    )
  }

  replyReviewPriceWorkflow(body: EditWorkFlowRequest): Observable<any> {
    let url = endpoint + '/replyReviewPrice';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("replyReviewPriceWorkflow Success"))
    );
  }

  approveReviewPriceWorkflow(body: EditWorkFlowRequest): Observable<any> {
    let url = endpoint + '/makeDecisionReviewPrice';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("approveReviewPriceWorkflow Success"))
    );
  }

  findAllReplyWorkflow(workflowId, page, size): Observable<any> {
    let url = endpoint + '/findAllReplyWorkflow/' + workflowId + '?page=' + page + '&size=' + size;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findAllReplyWorkflow Success"))
    )
  }

  replyReviewRelativeWorkflow(body: EditWorkFlowRequest): Observable<any> {
    let url = endpoint + '/replyReviewRelative';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("replyReviewRelative Success"))
    );
  }

  approveReviewRelativeWorkflow(body: EditWorkFlowRequest): Observable<any> {
    let url = endpoint + '/makeDecisionReviewRelative';
    return this.http.put(url, body, httpOptions).pipe(
      tap(_ => console.log("approveReviewRelativeWorkflow Success"))
    );
  }

  findDistinctCreateByAndAssignTo(workflowId): Observable<any> {
    let url = endpoint + '/findDistinctCreateByAndAssignTo/' + workflowId;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findDistinctCreateByAndAssignTo Success"))
    )
  }

  findDistinctAssignToAndCreateBy(workflowId): Observable<any> {
    let url = endpoint + '/findDistinctAssignToAndCreateBy/' + workflowId;
    return this.http.get(url, httpOptions).pipe(
      tap(_ => console.log("findDistinctAssignToAndCreateBy Success"))
    )
  }



}
