import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-dialog-typesecondcal',
  templateUrl: './dialog-typesecondcal.component.html',
  styleUrls: ['./dialog-typesecondcal.component.scss']
})
export class DialogTypesecondcalComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;

  dataAll = new MatTableDataSource();
  dataResult = new Array();
  displayedColumns: string[] = ['action', 'weightCode', 'weightSubcode', 'description', 'weight'];

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  page = 0;
  size = 10;

  constructor(
    public dialogRef: MatDialogRef<DialogTypesecondcalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightService,
    private otherActionWeightDataRequest: OtherActionWeightDataRequest,
    private loading: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.checkDataMapping();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkDataMapping() {
    // let listData = new Array();
    // this.weightService.getWeightAndWeightDataByBaseYearAndNotDataId(this.data.baseYearId, this.data.baseYearStatus, this.page, this.size, this.data.step, this.data.value.weightDataId).subscribe((res) => {
    //   this.length = res.totalElements;
    //   res.content.forEach(element => {
    //     element.checked = false;
    //     listData.push(element);
    //   });
    //   this.dataAll = new MatTableDataSource(listData);
    // });
  }

  pageChange(e: PageEvent): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.checkDataMapping();
    return e;
  }

  selectResult(event) {
    if (this.dataResult.length) {
      let n = this.dataResult.map(function (e) { return e.weightDataId; }).indexOf(event.weightDataId);
      console.log(n);
      if (n < 0) {
        this.dataResult.push(event);
      } else {
        this.dataResult.splice(n, 1);
      }
    } else {
      this.dataResult.push(event);
    }
  }

  sortingArr(list: any[]) {
    let sortedArray: any[] = list.sort((obj1, obj2) => {
      if (obj1.weightDataId > obj2.weightDataId) {
        return 1;
      }

      if (obj1.weightDataId < obj2.weightDataId) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }

  onSubmitSelect() {
    this.otherActionWeightDataRequest = new OtherActionWeightDataRequest();
    // this.otherActionWeightDataRequest.dataId = this.data.value.weightDataId;
    // this.otherActionWeightDataRequest.actionId = this.data.actionId;
    if (this.dataResult.length) {
      let weightParent: number = this.data.value.weight;
      let weightChild: number = 0;
      let diffWeight: number = 0;
      let weight: number = weightParent / this.dataResult.length;
      let adjustWeight = parseFloat(weight.toFixed(5));

      this.sortingArr(this.dataResult).forEach(element => {
        weightChild += adjustWeight;
        let data = { "dataId": element.weightDataId, "adjustWeight": adjustWeight };
        // this.otherActionWeightDataRequest.listChildData.push(data);
      });

      if (weightChild < weightParent) {
        // let lastIndex = this.otherActionWeightDataRequest.listChildData.length - 1;
        diffWeight = weightParent - weightChild;
        let weightPlus: number = adjustWeight + diffWeight;
        // this.otherActionWeightDataRequest.listChildData[lastIndex].adjustWeight = parseFloat(weightPlus.toFixed(5));
      }
      this.addSwal.show();
    }
    else {
      this.warningSwal.text = 'กรุณาเลือกปลายทาง';
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
