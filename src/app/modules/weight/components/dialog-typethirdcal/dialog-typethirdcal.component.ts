import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef, PageEvent } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { OtherActionWeightDataRequest } from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;
@Component({
  selector: 'app-dialog-typethirdcal',
  templateUrl: './dialog-typethirdcal.component.html',
  styleUrls: ['./dialog-typethirdcal.component.scss']
})
export class DialogTypethirdcalComponent implements OnInit {

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
    public dialogRef: MatDialogRef<DialogTypethirdcalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightService,
    private otherActionWeightDataRequest: OtherActionWeightDataRequest,
    private loading: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.checkDataMapping();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
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

  selectResult(event, e) {
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

  onSubmitSelect() {
    let sumPercent = 0;
    this.dataResult.forEach(element => {
      sumPercent += element.adjustedWeight;
    });
    if (sumPercent <= 0) {
      this.warningSwal.title = 'กรุณาเลือกข้อมูลปลายทาง';
      this.warningSwal.show();
    }

    else {
      this.otherActionWeightDataRequest = new OtherActionWeightDataRequest();
      // this.otherActionWeightDataRequest.dataId = this.data.value.weightDataId;
      // this.otherActionWeightDataRequest.actionId = this.data.actionId;

      let weightParent: number = this.data.value.adjustedWeight;
      let sumWeight: number = 0;
      let sumPercentTest = 0;
      this.dataResult.forEach(element => {
        let percent: number = element.adjustedWeight / sumPercent;
        sumPercentTest += percent;
        let weight: number = weightParent * percent;
        let adjustWeight = parseFloat(weight.toFixed(5));
        sumWeight += adjustWeight;
        let data = { "dataId": element.weightDataId, "adjustWeight": adjustWeight };
        // this.otherActionWeightDataRequest.listChildData.push(data);
      });
      // console.log(sumPercentTest);
      // console.log(parseFloat(sumWeight.toFixed(5)));
      // console.log(sumWeight);
      // console.log(weightParent);
      if (parseFloat(sumWeight.toFixed(5)) == weightParent) {
        this.addSwal.show();
      }
      else if (parseFloat(sumWeight.toFixed(5)) != weightParent) {
        let diffWeight: number = weightParent - parseFloat(sumWeight.toFixed(5));
        // let lastIndex = this.otherActionWeightDataRequest.listChildData.length - 1;
        // let arrWeight = this.otherActionWeightDataRequest.listChildData[lastIndex].adjustWeight;
        // let weight: number = arrWeight + parseFloat(diffWeight.toFixed(5));
        // this.otherActionWeightDataRequest.listChildData[lastIndex].adjustWeight = parseFloat(weight.toFixed(5));
        sumWeight += parseFloat(diffWeight.toFixed(5));
        if (parseFloat(sumWeight.toFixed(5)) == weightParent) {
          this.addSwal.show();
        }
      }
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
