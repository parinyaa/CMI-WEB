import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatTableDataSource, MatDialog, PageEvent } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightCpipService } from 'src/app/core/service/weightcpip/weight-cpip.service';
import { HistoryStepComponent } from '../history-step/history-step.component';
import { Message } from 'src/app/shared/message';

@Component({
  selector: 'app-weight-cancel-step',
  templateUrl: './weight-cancel-step.component.html',
  styleUrls: ['./weight-cancel-step.component.scss']
})
export class WeightCancelStepComponent implements OnInit {

  @Input() weight;
  displayedColumns: string[] = ['weightCode', 'description', 'paramCode', 'action'];
  @ViewChild('deleteSwal', { static: false }) deleteSwal: SwalComponent;
  @ViewChild('deletedSucessSwal', { static: false }) deletedSucessSwal: SwalComponent;
  dataSource: MatTableDataSource<any>;
  dataWeightStep = new Array();
  weightStepDeleted ;

  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;

  constructor(
    public dialog: MatDialog,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
   }

  ngOnInit(): void {
    console.log(this.weight);
    this.getWeightStep(this.pageEvent);
  }

  getWeightStep(pageEvent: PageEvent) {
    this.loading.show();
    this.weightService.getStep(this.weight.weightId, pageEvent.pageIndex, pageEvent.pageSize).subscribe(res => {
      this.loading.hide();
      this.dataSource = new MatTableDataSource(res.inquiryStepAndHistoryList);
      this.noDataSource = this.dataSource.data.length == 0 ? true : false;
      this.length = res.totalElements;
    });
  }

  onDeleteGetWeightStep(){
    this.getWeightStep(this.pageEvent);
  }

  pageChange(e){
    this.getWeightStep(e);
    return e;
  }

  dialogHistory(weight: any): void {
    console.log('history');
    const dialogRef = this.dialog.open(HistoryStepComponent, {
      width: '1500px',
       data: { data1: weight.weightHistory }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
      }
    });
  }

  onDeleteSwal(weight: any) {
    this.weightStepDeleted = weight.weightStep.weightStepId ;
    this.deleteSwal.title = 'คุณต้องการลบ ใช่หรือไม่?';
    this.deleteSwal.show();
  }

  onDelete(): void {
    this.loading.show();
    this.weightService.cancelStep(this.weightStepDeleted).subscribe(
      (res) => {

         if (res.code === '200'){
          this.loading.hide();
          this.deletedSucessSwal.title = Message.MESSAGE_DELETE_SUCCESS;
          this.deletedSucessSwal.show();
         }
        else {

        }
       }, (error) => {
         this.loading.hide();
       }
     );
   }

}
