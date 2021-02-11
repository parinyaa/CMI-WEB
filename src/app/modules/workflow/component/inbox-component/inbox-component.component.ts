import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DialogCreateInboxComponent } from '../dialog-create-inbox/dialog-create-inbox.component';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { CalendarService } from 'src/app/core/service/calendar/calendar.service';
import { isEmpty } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogEditInboxComponent } from '../dialog-edit-inbox/dialog-edit-inbox.component';
import { DialogResultDecisonComponent } from '../dialog-result-decison/dialog-result-decison.component';

@Component({
  selector: 'app-inbox-component',
  templateUrl: './inbox-component.component.html',
  styleUrls: ['./inbox-component.component.scss']
})
export class InboxComponentComponent implements OnInit {

  @ViewChild('deleteWorkflowSwal', { static: false }) deleteWorkflowSwal: SwalComponent;
  @ViewChild('succussDeleteSwal', { static: false }) succussDeleteSwal: SwalComponent;

  paramList = new Array();
  frequencyList = new Array();
  workflowTypeList = new Array();
  durationFortnightList = new Array();
  durationMonthList = new Array();
  durationWeekList = new Array();

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;


  page = 0;
  size = 10;
  index = 0;

  noData = true;

  displayedColumns: string[] = ['position', 'frequency', 'durationCode', 'extendDate', 'status', 'note', 'edit', 'delete', 'result'];
  dataSource = new Array();

  constructor(
    private WorkflowService: WorkflowService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private paramService: ParamService,
    private calendarService: CalendarService,
  ) { }

  ngOnInit() {
    this.getAllWorkFlow(this.page, this.size);
    this.getParam();
    this.getDurationCode();
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getAllWorkFlow(this.page, this.size);
    return e;
  }


  openCreateFlowDialog() {
    let data = {
      frequencyList: this.frequencyList,
      workflowTypeList: this.workflowTypeList,
      durationFortnightList: this.durationFortnightList,
      durationMonthList: this.durationMonthList,
      durationWeekList: this.durationWeekList
    }
    const dialogRef = this.dialog.open(DialogCreateInboxComponent, {
      width: '850px',
      position: {
        top: '3%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllWorkFlow(this.page, this.size);
      }
    });
  }

  getAllWorkFlow(page, size) {
    // this.loading.show();
    // this.WorkflowService.findAllWorkflow(page, size).subscribe((res) => {
    //   this.loading.hide();
    //   if (res.empty) {
    //     this.noData = true;
    //   }
    //   else {
    //     this.noData = false;
    //     this.dataSource = res.content;
    //     this.length = res.totalElements;
    //   }
    // },
    //   (error) => {
    //     this.loading.hide();
    //   });
  }

  getDurationCode() {
    this.calendarService.getCalendarCurrentmonth().subscribe((res) => {
      if (res.length > 0) {
        this.durationFortnightList = res[0].fortnight;
        this.durationMonthList = res[0].month;
        this.durationWeekList = res[0].week;
      }
    },
      (error) => {
        console.log(error);
      });
  }

  getParam() {
    this.paramService.getParamsGroup().subscribe((res) => {
      this.paramList = res;
      this.getParamFrequencyAndWorkflow();
    });
  }

  getParamFrequencyAndWorkflow() {
    this.paramList.forEach(element => {
      if (element.paramGroup == 'WORKFLOW_TYPE') {
        this.workflowTypeList = element.info;
      }
      else if (element.paramGroup == 'FREQUENCY') {
        element.info.forEach(element2 => {
          if (element2.paramInfo != 'DAILY') {
            this.frequencyList.push(element2);
          }
        });
      }
    });
  }

  openEditCreateFlowDialog(element) {
    let data = {
      element: element,
    }
    const dialogRef = this.dialog.open(DialogEditInboxComponent, {
      width: '850px',
      position: {
        top: '3%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllWorkFlow(this.page, this.size);
      }
    });
  }

  deleteWorkflow(element) {
    this.deleteWorkflowSwal.title = 'ยืนยันที่จะลบ ?';
    // this.deleteWorkflowSwal.text = 'คำขอ ' + element.description;
    this.deleteWorkflowSwal.show().then((result) => {
      if (result.value) {
        this.loading.show();
        this.WorkflowService.deleteWorkflow(element.workflowId).subscribe((res) => {
          this.loading.hide();
          this.getAllWorkFlow(this.page, this.size);
          this.succussDeleteSwal.show();
        },
          (error) => {
            this.loading.hide();
          });
      }
    });
  }

  openResultCreateFlowDialog(element) {
    const dialogRef = this.dialog.open(DialogResultDecisonComponent, {
      width: '600px',
      position: {
        top: '10%'
      },
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
}
