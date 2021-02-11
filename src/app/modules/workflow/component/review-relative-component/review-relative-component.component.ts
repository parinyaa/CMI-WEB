import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageEvent, MatTableDataSource, MatSort, DateAdapter } from '@angular/material';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParamService } from 'src/app/core/service/param/param.service';
import { InquiryWorkflowRequest } from 'src/app/shared/models/workflow/request/InquiryWorkflowRequest.model';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-relative-component',
  templateUrl: './review-relative-component.component.html',
  styleUrls: ['./review-relative-component.component.scss']
})
export class ReviewRelativeComponentComponent implements OnInit {


  paramList = new Array();
  createByList = new Array();
  statusList = ['NEW', 'APPROVE', 'REPLY'];
  workflowType;
  inquiryWorkflowForm: FormGroup;
  submitted = false;
  userProfile;
  isCreate = false;
  isReply = false;
  noData = false;
  isInquiryMode = false;

  page = 0;
  size = 10;
  index = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;
  displayedColumns: string[] = ['position', 'createdDate', 'note', 'status', 'action'];
  dataSource = new MatTableDataSource();
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
  ) {
    this.checkObject();
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {
    this.getParam();
    this.initForm();
  }

  checkObject() {
    this.userProfile = this.sessionService.getUserProfile();
    this.userProfile.objects.forEach(element => {
      if (element == 'CREATE_REVIEW_RELATIVE') {
        this.isCreate = true;
      }
      else if (element == 'REPLY_REVIEW_RELATIVE') {
        this.isReply = true;
      }
    });
  }

  findCreateByList() {
    if (this.isReply) {
      this.WorkflowService.findDistinctCreateByAndAssignTo(this.workflowType.paramId).subscribe((res) => {
        this.createByList = res;
      });
    }
    else if (this.isCreate) {
      this.WorkflowService.findDistinctAssignToAndCreateBy(this.workflowType.paramId).subscribe((res) => {
        this.createByList = res;
      });
    }
  }

  initForm() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.inquiryWorkflowForm = this._FormBuild.group({
      startDate: [firstDay, Validators.required],
      endDate: [lastDay, Validators.required],
      createBy: [this.isCreate ? this.userProfile.userCode : '', Validators.required],
      status: ['', Validators.required],
      assignTo: [this.isReply ? this.userProfile.userCode : '', Validators.required]
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
          if (element2.paramInfo == "REVIEW_RELATIVE") {
            this.workflowType = element2;
          }
        });
      }
    });
    this.findCreateByList();
    if (this.isReply) {
      this.getAllReplyWorkflow();
    }
    // else if (this.isCreate) {
    //   this.getAllCreateWorkFlow();
    // }
  }

  getAllReplyWorkflow() {
    this.loading.show();
    this.WorkflowService.findAllReplyWorkflow(this.workflowType.paramId, this.page, this.size).subscribe((res) => {
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

  pageChange(e: PageEvent): PageEvent {
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    if (this.isInquiryMode) {
      this.inquiryWorkflow();
    }
    else {
      if (this.isReply) {
        this.getAllReplyWorkflow();
      }
      // else if (this.isCreate) {
      //   this.getAllCreateWorkFlow();
      // }
    }
    return e;
  }

  onSubmit() {
    console.log(this.inquiryWorkflowForm);
    this.submitted = true;
    if (this.inquiryWorkflowForm.invalid) {
      return
    } else {
      this.inquiryWorkflow();
    }
  }

  inquiryWorkflow() {
    this.isInquiryMode = true;
    this.inquiryWorkflowRequest.createBy = this.workflowType.value.createBy;
    this.inquiryWorkflowRequest.endDate = this.workflowType.value.endDate;
    this.inquiryWorkflowRequest.page = this.page;
    this.inquiryWorkflowRequest.size = this.size;
    this.inquiryWorkflowRequest.startDate = this.workflowType.value.startDate;
    this.inquiryWorkflowRequest.status = this.workflowType.value.status
    this.inquiryWorkflowRequest.workflowTypeId = this.workflowType.paramId;
    this.inquiryWorkflowRequest.assignTo = this.workflowType.value.assignTo;
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

  // getAllCreateWorkFlow() {
  //   this.loading.show();
  //   this.WorkflowService.findAllWorkflow(this.workflowType.paramId, this.page, this.size).subscribe((res) => {
  //     this.loading.hide();
  //     if (res.empty) {
  //       this.noData = true;
  //     }
  //     else {
  //       this.noData = false;
  //       this.dataSource = new MatTableDataSource(res.content);
  //       this.dataSource.sort = this.sort;
  //       this.length = res.totalElements;
  //     }
  //   },
  //     (error) => {
  //       this.loading.hide();
  //     });
  // }

  get f() { return this.inquiryWorkflowForm.controls; }

  openURLAssignTo(e) {
    let note: string = e.note;
    let commodityCode: string = note.split('$1')[1];
    console.log(e);
    this.router.navigateByUrl(e.assignUrl, { state: { 'commodityCode': commodityCode, 'fromWorkflow': true } });

  }

  openURLCreator(e) {
    let note: string = e.note;
    let commodityCode: string = note.split('$1')[1];
    console.log(e);
    this.router.navigateByUrl(e.creatorUrl, { state: { 'commodityCode': commodityCode, 'fromWorkflow': true } });

  }

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

}
