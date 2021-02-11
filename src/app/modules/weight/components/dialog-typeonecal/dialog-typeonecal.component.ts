import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, PageEvent } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-typeonecal',
  templateUrl: './dialog-typeonecal.component.html',
  styleUrls: ['./dialog-typeonecal.component.scss']
})
export class DialogTypeonecalComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  // displayedColumns: string[] = ['action', 'amphurId', 'deptCode', 'province', 'branchname', 'price'];
  displayedColumns: string[] = ['action', 'weightCode', 'weightSubcode', 'description', 'weight'];
  dataAll = new MatTableDataSource();
  selectedResult: any;
  selected: any;

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  page = 0;
  size = 10;


  constructor(
    public dialogRef: MatDialogRef<DialogTypeonecalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightService,
    private otherActionWeightDataRequest: OtherActionWeightDataRequest,
    private loading: NgxSpinnerService,
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.checkDataMapping();
  }

  checkDataMapping() {
    let listData = new Array();
    this.weightService.getWeightAndWeightDataByBaseYearAndNotDataId(this.data.weight.weightId, this.page, this.size, this.data.step, this.data.value.weightDataId).subscribe((res) => {
      this.length = res.totalElements;
      res.content.forEach(element => {
        element.checked = false;
        listData.push(element);
      });
      this.dataAll = new MatTableDataSource(listData);
    });
  }

  pageChange(e: PageEvent): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.checkDataMapping();
    return e;
  }



  onNoClick(): void {
    this.dialogRef.close(false);
  }

  selectResult(data, event) {
    this.dataAll.data.forEach(element => {
      let tmp: any = element;
      if (tmp.weightDataId != data.weightDataId) {
        tmp.checked = false;
      }
      else {
        if (event.checked) {
          tmp.checked = true;
          this.selectedResult = tmp;
        }
        else {
          tmp.checked = false;
          this.selectedResult = undefined;
        }
      }
      element = tmp;
    });
  }

  onSubmitSelect() {
    if (this.selectedResult !== undefined) {
      this.otherActionWeightDataRequest = new OtherActionWeightDataRequest();
      let data = { "dataId": this.selectedResult.weightDataId, "adjustWeight": this.data.value.adjustedWeight };
      // this.otherActionWeightDataRequest.dataId = this.data.value.weightDataId;
      // this.otherActionWeightDataRequest.actionId = this.data.actionId;
      // this.otherActionWeightDataRequest.listChildData.push(data);
      this.addSwal.show();
    }
    else {
      this.warningSwal.title = 'กรุณาเลือกข้อมูลปลายทาง';
      this.warningSwal.show();
    }
  }

  calWeightSubmit() {
    this.loading.show();
    this.weightService.otherActionWeightDataById(this.otherActionWeightDataRequest).subscribe((res) => {
      this.loading.hide();
      this.succussSwal.show();
    },
      (err) => {
        this.errorSwal.text = err.error.messageEn;
        this.errorSwal.title = err.error.messageTh;
        this.loading.hide();
        this.errorSwal.show();
      });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
