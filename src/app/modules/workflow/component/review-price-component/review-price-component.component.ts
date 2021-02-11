import { element } from 'protractor';
import { filter } from 'rxjs/operators';
import { FilterPriceDataRequest } from './../../../../shared/models/datamatrix/FilterPriceDataRequest';
import { DatamatrixService } from './../../../../core/service/datamatrix/datamatrix.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter, PageEvent, MatSort, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ParamService } from 'src/app/core/service/param/param.service';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { InquiryWorkflowRequest } from 'src/app/shared/models/workflow/request/InquiryWorkflowRequest.model';
import { InspectParameter } from '../../../commodity-validate/models/inspect-parameter';



@Component({
  selector: 'app-review-price-component',
  templateUrl: './review-price-component.component.html',
  styleUrls: ['./review-price-component.component.scss']
})
export class ReviewPriceComponentComponent implements OnInit {

  isInquiryMode = false;
  paramList = new Array();
  createByList = new Array();
  assignToList = new Array();
  statusList = ['NEW', 'APPROVE', 'REPLY'];
  workflowType;
  inquiryPriceForm: FormGroup;
  submitted = false;
  userProfile;
  isCreate = false;
  isReply = false;
  noData = true;
  page = 0;
  size = 10;
  index = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;
  displayedColumns: string[] = ['position', 'createdDate', 'note', 'status', 'action'];
  dataSource = new MatTableDataSource();
  findCreateByStatus = false;
  workflowList = new Array();
  sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(
    private sessionService: SessionServiceService,
    private WorkflowService: WorkflowService,
    private loading: NgxSpinnerService,
    private paramService: ParamService,
    private dateAdapter: DateAdapter<Date>,
    private _FormBuild: FormBuilder,
    private inquiryWorkflowRequest: InquiryWorkflowRequest,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datamatrixService: DatamatrixService
  ) {
    this.checkObject();
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      const refresh = paramMap.get('time');
      if (refresh) {
        this.getParam();
        this.initForm();
        this.dataSource.sort = this.sort;
      }
    });

  }

  checkObject() {
    this.userProfile = this.sessionService.getUserProfile();
    this.userProfile.objects.forEach(element => {
      if (element == 'CREATE_REVIEW_PRICE') {
        this.isCreate = true;
      }
      else if (element == 'REPLY_REVIEW_PRICE') {
        this.isReply = true;
      }
    });
  }


  initForm() {

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.inquiryPriceForm = this._FormBuild.group({
      startDate: [firstDay, Validators.required],
      endDate: [lastDay, Validators.required],
      createBy: ['',],
      status: ['',],
      assignTo: ['',]
    });

  }

  getParam() {
    this.paramService.getParamsGroup().subscribe((res) => {
      this.paramList = res;
      this.getParamFrequencyAndWorkflow();
    }, (error) => {
      this.loading.hide();
    });
  }

  getParamFrequencyAndWorkflow() {
    this.paramList.forEach(element => {
      if (element.paramGroup == 'WORKFLOW_TYPE') {
        element.info.forEach(element2 => {
          if (element2.paramInfo == "REVIEW_PRICE") {
            this.workflowType = element2;
          }
        });
      }
    });

    if (this.isReply && this.isCreate) {
      this.getAllCreateOrReplyWorkFlow();
    } else {
      if (this.isReply) {
        this.getAllReplyWorkflow();
      } 
      // else if (this.isCreate) {
      //   this.getAllCreateWorkFlow();
      // }
    }
  }

  getAllReplyWorkflow() {
    this.loading.show();
    this.WorkflowService.findAllReplyWorkflow(this.workflowType.paramId, this.page, this.size).subscribe((res) => {
      this.loading.hide();
      if (res.empty) {
        this.noData = true;
      }
      else {
        console.log(res);
        this.noData = false;
        this.dataSource = new MatTableDataSource(res.content);
        if (!this.findCreateByStatus) {
          this.workflowList = res.content;
          this.findCreateByList();
          this.findCreateByStatus = true;
        }
        this.dataSource.sort = this.sort;
        this.length = res.totalElements;
      }
    });
  }

  pageChange(e: PageEvent): PageEvent {
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    if (this.isInquiryMode) {
      this.inquiryWorkflow();
    } else {
      if (this.isReply && this.isCreate) {
        this.getAllCreateOrReplyWorkFlow();
      }
      else if (this.isReply) {
        this.getAllReplyWorkflow();
      } 
      // else if (this.isCreate) {
      //   this.getAllCreateWorkFlow();
      // }
    }
    return e;
  }

  openURLAssignTo(element) {
    let filterPrice = new FilterPriceDataRequest();
    console.log(element);
    filterPrice.cpaId = element.cpaId;
    filterPrice.dataMatrixId = element.dataMatrixId;
    filterPrice.yearTerm = element.yearTerm;
    filterPrice.monthTerm = element.monthTerm;
    let frequency = null;
    let commodityCode = null;
    let commodityName = null;
    let surveyName = null
    this.datamatrixService.filterPrice(filterPrice).subscribe(
      (res) => {
        if (res.length > 0) {
          console.log(res);
          commodityCode = res[0].commodityCode;
          commodityName = res[0].commodityName;
          surveyName = res[0].surveyName;
          frequency = res[0].frequency;
          let link = element.assignUrl;
          this.router.navigateByUrl(link, { state: { 'frequency': frequency, 'commodityCode': commodityCode, 'commodityName': commodityName, 'surveyName': surveyName } });
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  openURLCreator(element) {
    let filterPrice = new FilterPriceDataRequest();
    console.log(element);
    filterPrice.cpaId = element.cpaId;
    filterPrice.dataMatrixId = element.dataMatrixId;
    filterPrice.yearTerm = element.yearTerm;
    filterPrice.monthTerm = element.monthTerm;

    const url = element.creatorUrl;
    const cpaId = element.cpaId;
    const dataMatrixId = element.dataMatrixId;
    const yearTerm = element.yearTerm;
    const monthTerm = element.monthTerm;

    const param: InspectParameter = new InspectParameter();
    param.cpaId = cpaId;
    param.dataMatrixId = dataMatrixId;
    param.yearTerm = yearTerm;
    param.monthTerm = monthTerm;

    this.datamatrixService.filterPrice(filterPrice).subscribe(
      (res) => {
        if (res.length > 0) {
          console.log(res);
          let xCode: string = res[0].commodityCode;
          console.log(xCode);
          xCode = xCode.substr(0, 9);
          console.log(xCode);
          param.commodityCode = xCode;
          // param.commodityName = res[0].commodityName;
          param.surveyName = res[0].surveyName;
          this.sessionService.setInspectParam(param);
          this.router.navigateByUrl(url);
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    console.log(this.inquiryPriceForm);
    this.submitted = true;
    if (this.inquiryPriceForm.invalid) {
      return
    } else {
      this.inquiryWorkflow();
    }
  }

  inquiryWorkflow() {
    this.isInquiryMode = true;
    this.inquiryWorkflowRequest.createBy = this.inquiryPriceForm.value.createBy || "";
    this.inquiryWorkflowRequest.endDate = this.inquiryPriceForm.value.endDate;
    this.inquiryWorkflowRequest.page = this.page;
    this.inquiryWorkflowRequest.size = this.size;
    this.inquiryWorkflowRequest.startDate = this.inquiryPriceForm.value.startDate;
    this.inquiryWorkflowRequest.status = this.inquiryPriceForm.value.status || "";
    this.inquiryWorkflowRequest.workflowTypeId = this.workflowType.paramId;
    this.inquiryWorkflowRequest.assignTo = this.inquiryPriceForm.value.assignTo || "";
    console.log("inquiryWorkflowRequest", this.inquiryWorkflowRequest);
    this.loading.show();
    this.WorkflowService.inquiryWorkflow(this.inquiryWorkflowRequest).subscribe((res) => {
      this.loading.hide();
      if (res.empty) {
        this.noData = true;
      }
      else {
        this.noData = false;
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.sort = this.sort;
        this.length = res.totalElements;
      }
    });
  }

  findCreateByList() {
    this.workflowList.forEach(element => {
      this.createByList.push(element.createdBy);
      this.assignToList.push(element.assignTo);
    });
    this.createByList = this.createByList.filter(
      (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
    this.assignToList = this.assignToList.filter(
      (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
  }

  // getAllCreateWorkFlow() {
  //   this.loading.show();
  //   this.WorkflowService.findAllWorkflow(this.workflowType.paramId, this.page, this.size).subscribe((res) => {
  //     this.loading.hide();
  //     if (res.empty) {
  //       this.noData = true;
  //     }
  //     else {
  //       console.log("getAllCreateWorkFlow", res);
  //       this.noData = false;
  //       this.dataSource = new MatTableDataSource(res.content);
  //       if (!this.findCreateByStatus) {
  //         this.workflowList = res.content;
  //         this.findCreateByList();
  //         this.findCreateByStatus = true;
  //       }
  //       this.dataSource.sort = this.sort;
  //       this.length = res.totalElements;
  //     }
  //   },
  //     (error) => {
  //       this.loading.hide();
  //     });
  // }

  onSortData(event) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        // case 'position': {
        //   return item['frequency'].paramLocalDescription;
        // }       
        case 'createdDate': {
          return item['createdDate'];
        }
        default:
          return item[property];
      }
    };
  }

  get f() { return this.inquiryPriceForm.controls; }

  getAllCreateOrReplyWorkFlow() {
    this.loading.show();
    this.WorkflowService.findWorkFlowCreateOrReply(this.workflowType.paramId, this.page, this.size).subscribe((res) => {
      this.loading.hide();
      if (res.empty) {
        this.noData = true;
      }
      else {
        this.noData = false;
        this.dataSource = new MatTableDataSource(res.content);
        if (!this.findCreateByStatus) {
          this.workflowList = res.content;
          this.findCreateByList();
          this.findCreateByStatus = true;
        }
        console.log("getAllCreateOrReplyWorkFlow", res);
        this.dataSource.sort = this.sort;
        this.length = res.totalElements;
      }
    },
      (error) => {
        this.loading.hide();
      });
  }

}
