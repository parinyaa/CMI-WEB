import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef, PageEvent, MatDialog } from '@angular/material';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { RepDeletelistDataNotImportant } from 'src/app/shared/models/weight/request/RepDeletelistDataNotImportant.model';
import { WeightCpipService } from 'src/app/core/service/weightcpip/weight-cpip.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogCancelWeightStepComponent } from '../dialog-cancel-weight-step/dialog-cancel-weight-step.component';

@Component({
  selector: 'app-view-delete',
  templateUrl: './view-delete.component.html',
  styleUrls: ['./view-delete.component.scss']
})
export class ViewDeleteComponent implements OnInit {

  displayedColumns: string[] = ['action', 'weightCode', 'description', 'weight', 'adjustedWeight'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('saveSwal', { static: false }) saveSwal: SwalComponent;
  @ViewChild('saveSucessSwal', { static: false }) saveSucessSwal: SwalComponent;
  @ViewChild('saveSwal', { static: false }) saveErrorSwal: SwalComponent;
  dataSource: MatTableDataSource<any>;
  dataResult = new Array();
  submitted = false;
  
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [25, 100, 150, 200, 1000];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;

  repDeletelistDataNotImportant = new  RepDeletelistDataNotImportant() ;
  weight: any;
  actionDelete: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    public dialogRef: MatDialogRef<ViewDeleteComponent>,
    private dialog: MatDialog,
   ) { 
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
   }

  ngOnInit(): void {
    this.inquiryDeleted(this.pageEvent);
  }

  inquiryDeleted(pageEvent: PageEvent){
    this.loading.show();
    this.weightService.inquiryDeleted(this.data.weight.weightId, pageEvent.pageIndex, pageEvent.pageSize).subscribe((res) => {
      this.loading.hide();
      this.dataSource = new MatTableDataSource(res.listWeightData);
      this.noDataSource = this.dataSource.data.length == 0 ? true : false;
      this.length = res.totalElements;

      this.dataResult = this.dataSource.data;
    },
      (error) => {
        this.loading.hide();
        console.log('inquiryDeleted', error);
      });
  }
selectResult(event, e) {
  for(var i=0 ; i<this.dataResult.length ; i++){
    if(this.dataResult[i].weightDataId === event.weightDataId){
      this.dataResult[i].checked = e;
    }
  }
}

selectALL(e) {
  for(var i=0 ; i<this.dataResult.length ; i++){
    this.dataResult[i].checked = e;
  }
}

openDeleteDialog() {
  this.dataResult = this.dataResult.filter(e => e.checked != null && e.checked.checked);

  this.repDeletelistDataNotImportant.weightId = this.data.weight.weightId;
  this.repDeletelistDataNotImportant.listData = this.dataResult ;
  const dialogRef = this.dialog.open(DialogCancelWeightStepComponent, {
    width: '750px',
    data: this.repDeletelistDataNotImportant
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.inquiryDeleted(this.pageEvent);
    }
  });
}

onSave() {
  this.loading.show();
  this.repDeletelistDataNotImportant.weightId = this.data.data1;
  this.repDeletelistDataNotImportant.listData = this.dataResult ;
  console.log('loglistdataaaa', this.repDeletelistDataNotImportant.listData);
  this.weightService.DelDataNotImportant(this.repDeletelistDataNotImportant).subscribe((res) => {
     console.log('insert transaction success', res);
     this.loading.hide();
     //this.dialogRef.close(true);
    //  if (res.code === '200') {
    //    console.log('in');
    //    this.dialogRef.close(true);
    //   // this.saveSucessSwal.title = "SUCCESS";
    //  //   this.saveSucessSwal.fire();

    // } else {
      this.saveErrorSwal.title = res.message;
      this.saveErrorSwal.show();
      this.dialogRef.close(true);
    // }
  },
    (error) => {
      // this.loading.hide();
      console.log('testerror', error);
    });
  }
  cancel(status) {
    this.dialogRef.close(status);
  }

  pageChange(e){
    this.inquiryDeleted(e);
    return e;
  }

}
