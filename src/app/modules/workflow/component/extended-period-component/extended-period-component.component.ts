import {Component, OnInit, ViewChild} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  MatDialog,
  DateAdapter,
  PageEvent,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import {Router} from '@angular/router';
import {ParamService} from 'src/app/core/service/param/param.service';
import {CalendarService} from 'src/app/core/service/calendar/calendar.service';
import {DialogCreateInboxComponent} from '../dialog-create-inbox/dialog-create-inbox.component';
import {WorkflowService} from 'src/app/core/service/workflow/workflow.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SessionServiceService} from 'src/app/core/service/common/session-service.service';
import {InquiryWorkflowRequest} from 'src/app/shared/models/workflow/request/InquiryWorkflowRequest.model';
import {DialogEditInboxComponent} from '../dialog-edit-inbox/dialog-edit-inbox.component';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {DialogMakeDicisionComponent} from '../dialog-make-dicision/dialog-make-dicision.component';
import {DialogResultDecisonComponent} from '../dialog-result-decison/dialog-result-decison.component';

@Component({
  selector: 'app-extended-period-component',
  templateUrl: './extended-period-component.component.html',
  styleUrls: ['./extended-period-component.component.scss'],
})
export class ExtendedPeriodComponentComponent implements OnInit {
  @ViewChild('deleteWorkflowSwal', {static: false})
  deleteWorkflowSwal: SwalComponent;
  @ViewChild('succussDeleteSwal', {static: false})
  succussDeleteSwal: SwalComponent;

  isInquiryMode = false;
  noData = true;
  paramList = new Array();
  frequencyList = new Array();
  workflowTypeList = new Array();
  durationFortnightList = new Array();
  durationMonthList = new Array();
  durationWeekList = new Array();
  createByList = new Array();
  statusList = ['NEW', 'APPROVE', 'REJECT'];
  workflowType;
  inquiryWorkflowForm: FormGroup;
  submitted = false;
  isCreate = false;
  isApprove = false;
  isBoth = false;
  userProfile;

  page = 0;
  size = 10;
  index = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent();
  displayedColumns: string[] = [
    'position',
    'createdDate',
    'frequency',
    'durationCode',
    'extendDate',
    'note',
    'createdBy',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource();
  sort: MatSort;
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  constructor(
    private sessionService: SessionServiceService,
    private WorkflowService: WorkflowService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private paramService: ParamService,
    private calendarService: CalendarService,
    private dateAdapter: DateAdapter<Date>,
    private _FormBuild: FormBuilder,
    private inquiryWorkflowRequest: InquiryWorkflowRequest,
  ) {
    this.checkObject();
    dateAdapter.setLocale('th-TH');
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.getParam();
    this.getDurationCode();
    this.initForm();
    this.dataSource.sort = this.sort;
  }

  openCreateFlowDialog() {
    let data = {
      frequencyList: this.frequencyList,
      workflowType: this.workflowType,
      durationFortnightList: this.durationFortnightList,
      durationMonthList: this.durationMonthList,
      durationWeekList: this.durationWeekList,
    };
    const dialogRef = this.dialog.open(DialogCreateInboxComponent, {
      width: '850px',
      position: {
        top: '3%',
      },
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isInquiryMode) {
          this.inquiryWorkflow();
        } else {
          if (this.isCreate) {
            this.getAllWorkFlow();
          }
          if (this.isBoth) {
            //เดิมELSE IF
            this.getAllWorkFlowAndDecision();
          }
        }
      }
    });
  }

  getParam() {
    this.paramService.getParamsGroup().subscribe(
      (res) => {
        this.paramList = res;
        this.getParamFrequencyAndWorkflow();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  getParamFrequencyAndWorkflow() {
    this.paramList.forEach((element) => {
      if (element.paramGroup == 'WORKFLOW_TYPE') {
        this.workflowTypeList = element.info;
        this.workflowTypeList.forEach((element2) => {
          if (element2.paramInfo == 'EXTENDED_PERIOD') {
            this.workflowType = element2;
          }
        });
      } else if (element.paramGroup == 'FREQUENCY') {
        element.info.forEach((element2) => {
          if (element2.paramInfo != 'DAILY') {
            this.frequencyList.push(element2);
          }
        });
      }
    });
    this.findCreateByList();
    if (this.isApprove) {
      this.getAllDesicion();
    }
    if (this.isCreate) {
      //milk
      this.getAllWorkFlow();
    }
    if (this.isBoth) {
      //Else if
      this.getAllWorkFlowAndDecision();
    }
  }

  getDurationCode() {
    this.calendarService.getCalendarCurrentmonth().subscribe(
      (res) => {
        if (res.length > 0) {
          this.durationFortnightList = res[0].fortnight;
          this.durationMonthList = res[0].month;
          this.durationWeekList = res[0].week;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.inquiryWorkflowForm.invalid) {
      return;
    } else {
      this.inquiryWorkflow();
    }
  }

  initForm() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.inquiryWorkflowForm = this._FormBuild.group({
      startDate: [firstDay, Validators.required],
      endDate: [lastDay, Validators.required],
      createBy: [this.isCreate ? this.userProfile.userId : ''],
      status: ['', Validators.required],
      assignTo: [''],
    });
  }

  get f() {
    return this.inquiryWorkflowForm.controls;
  }

  checkObject() {
    this.userProfile = this.sessionService.getUserProfile();
    this.userProfile.objects.forEach((element) => {
      if (element == 'CREATE_EXTENDED_PERIOD') {
        this.isCreate = true;
      } else if (element == 'DECISION_EXTENDED_PERIOD') {
        this.isApprove = true;
      }
    });
    if (this.isCreate && this.isApprove) {
      this.isCreate = false;
      this.isApprove = false;
      this.isBoth = true;
    }
  }

  findCreateByList() {
    if (this.isApprove) {
      this.WorkflowService.findDistinctCreateByNotSelf(
        this.workflowType.paramId,
      ).subscribe((res) => {
        this.createByList = res;
      });
    } else if (this.isBoth) {
      this.WorkflowService.findDistinctCreateByAll(
        this.workflowType.paramId,
      ).subscribe((res) => {
        this.createByList = res;
      });
    }
  }

  getAllDesicion() {
    this.loading.show();
    this.WorkflowService.findAllDecision(
      this.workflowType.paramId,
      this.page,
      this.size,
    ).subscribe(
      (res) => {
        this.loading.hide();
        if (res.empty) {
          this.noData = true;
        } else {
          this.noData = false;
          this.dataSource = new MatTableDataSource(res.content);
          console.log(res.content);
          this.dataSource.sort = this.sort;
          this.length = res.totalElements;
        }
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  getAllWorkFlowAndDecision() {
    this.loading.show();
    this.WorkflowService.findAllWorkflowAndDesicion(
      this.workflowType.paramId,
      this.page,
      this.size,
    ).subscribe(
      (res) => {
        this.loading.hide();
        if (res.empty) {
          this.noData = true;
        } else {
          this.noData = false;
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.sort = this.sort;
          this.length = res.totalElements;
        }
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  getAllWorkFlow() {
    this.loading.show();
    this.WorkflowService.findAllWorkflow(
      this.workflowType.paramId,
      this.page,
      this.size,
    ).subscribe(
      (res) => {
        this.loading.hide();
        if (res.empty) {
          this.noData = true;
        } else {
          this.noData = false;
          this.dataSource = new MatTableDataSource(res.content);
          console.log(res.content);
          this.dataSource.sort = this.sort;
          this.length = res.totalElements;
        }
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  inquiryWorkflow() {
    this.isInquiryMode = true;
    this.inquiryWorkflowRequest.createBy = this.inquiryWorkflowForm.value.createBy;
    this.inquiryWorkflowRequest.endDate = this.inquiryWorkflowForm.value.endDate;
    this.inquiryWorkflowRequest.page = this.page;
    this.inquiryWorkflowRequest.size = this.size;
    this.inquiryWorkflowRequest.startDate = this.inquiryWorkflowForm.value.startDate;
    this.inquiryWorkflowRequest.status = this.inquiryWorkflowForm.value.status;
    this.inquiryWorkflowRequest.workflowTypeId = this.workflowType.paramId;
    this.inquiryWorkflowRequest.assignTo = null;
    this.loading.show();
    this.WorkflowService.inquiryWorkflow(this.inquiryWorkflowRequest).subscribe(
      (res) => {
        this.loading.hide();
        if (res.empty) {
          this.noData = true;
        } else {
          this.noData = false;
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.sort = this.sort;
          this.length = res.totalElements;
        }
      },
    );
  }

  openEditCreateFlowDialog(element) {
    let data = {
      element: element,
    };
    const dialogRef = this.dialog.open(DialogEditInboxComponent, {
      width: '850px',
      position: {
        top: '3%',
      },
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isInquiryMode) {
          this.inquiryWorkflow();
        } else {
          if (this.isCreate) {
            this.getAllWorkFlow();
          }
          if (this.isBoth) {
            //Eles if
            this.getAllWorkFlowAndDecision();
          }
        }
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
      if (this.isApprove) {
        this.getAllDesicion();
      } else if (this.isCreate) {
        this.getAllWorkFlow();
      } else if (this.isBoth) {
        this.getAllWorkFlowAndDecision();
      }
    }
    return e;
  }

  deleteWorkflow(element) {
    this.deleteWorkflowSwal.title = 'ยืนยันที่จะลบ ?';
    // this.deleteWorkflowSwal.text = 'คำขอ ' + element.description;
    this.deleteWorkflowSwal.show().then((result) => {
      if (result.value) {
        this.loading.show();
        this.WorkflowService.deleteWorkflow(element.workflowId).subscribe(
          (res) => {
            this.loading.hide();
            if (this.isInquiryMode) {
              this.inquiryWorkflow();
            } else {
              if (this.isCreate) {
                this.getAllWorkFlow();
              }
              if (this.isBoth) {
                //Eles if
                this.getAllWorkFlowAndDecision();
              }
            }
            this.succussDeleteSwal.show();
          },
          (error) => {
            this.loading.hide();
          },
        );
      }
    });
  }

  openMakeDecisionDialog(element) {
    const dialogRef = this.dialog.open(DialogMakeDicisionComponent, {
      width: '600px',
      position: {
        top: '10%',
      },
      data: element.workflowId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isInquiryMode) {
          this.inquiryWorkflow();
        } else {
          if (this.isApprove) {
            this.getAllDesicion();
          } else if (this.isBoth) {
            this.getAllWorkFlowAndDecision();
          }
        }
      }
    });
  }

  openResultCreateFlowDialog(element) {
    const dialogRef = this.dialog.open(DialogResultDecisonComponent, {
      width: '600px',
      position: {
        top: '10%',
      },
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  onSortData(event) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'frequency': {
          return item['frequency'].paramLocalDescription;
        }
        case 'durationCode': {
          return item['durationCode'].durationCode;
        }
        case 'createdDate': {
          return item['createdDate'];
        }
        default:
          return item[property];
      }
    };
  }
}
