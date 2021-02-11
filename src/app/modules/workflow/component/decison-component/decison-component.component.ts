import { Component, OnInit } from '@angular/core';
import { PageEvent, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { DialogMakeDicisionComponent } from '../dialog-make-dicision/dialog-make-dicision.component';

@Component({
  selector: 'app-decison-component',
  templateUrl: './decison-component.component.html',
  styleUrls: ['./decison-component.component.scss']
})
export class DecisonComponentComponent implements OnInit {

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;


  page = 0;
  size = 10;
  index = 0;

  noData = true;

  displayedColumns: string[] = ['position', 'frequency', 'durationCode', 'extendDate', 'status', 'note', 'approve'];
  dataSource = new Array();

  constructor(
    private WorkflowService: WorkflowService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getAllDecisionWorkFlow(this.page, this.size);
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getAllDecisionWorkFlow(this.page, this.size);
    return e;
  }

  getAllDecisionWorkFlow(page, size) {
    // this.loading.show();
    // this.WorkflowService.findAllDecision(page, size).subscribe((res) => {
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

  openMakeDecisionDialog(element) {

    const dialogRef = this.dialog.open(DialogMakeDicisionComponent, {
      width: '600px',
      position: {
        top: '10%'
      },
      data: element.workflowId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllDecisionWorkFlow(this.page, this.size);
      }
    });
  }

}
