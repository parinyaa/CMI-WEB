import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {
  MatTableDataSource,
  MAT_DIALOG_DATA,
  MatDialogRef,
  PageEvent,
  MatDialog,
  MatPaginator,
} from '@angular/material';
import {RepWeightDataIdGive} from 'src/app/shared/models/weight/request/RepWeightDataIdGive.model';
import {WeightCpipService} from 'src/app/core/service/weightcpip/weight-cpip.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  OtherActionWeightDataRequest,
  WeightActionData,
} from 'src/app/shared/models/weight/request/OtherActionWeightDataRequest.model';
import {FormControl} from '@angular/forms';
import {DialogCompareWeightComponent} from '../dialog-compare-weight/dialog-compare-weight.component';
import { inquiryWeightDestination } from 'src/app/shared/models/weight/request/WeightMapping';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-add-move-weightthree-dialog',
  templateUrl: './add-move-weightthree-dialog.component.html',
  styleUrls: ['./add-move-weightthree-dialog.component.scss'],
})
export class AddMoveWeightthreeDialogComponent implements OnInit {
  @ViewChild('warningSwal',{static : false}) warningSwal : SwalComponent;
  @ViewChild(MatPaginator, {static:false}) paginator : MatPaginator;
  displayedColumns: string[] = [
    'action',
    'weightCode',
    'description',
    'adjustedWeight',
  ];
  dataSource: MatTableDataSource<any>;
  filterCommodityCodeControl = new FormControl();
  filterCommodityNameControl = new FormControl();
  dataSourceCpip: MatTableDataSource<any>;
  dataResult = new Array();
  reqWeightDataId = new RepWeightDataIdGive();

  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 25, 100, 1000];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;
  weightCode: string = '';
  weightName: string = '';
  weightGroup: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddMoveWeightthreeDialogComponent>,
    private dialog: MatDialog,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    console.log(this.data.data1);
    this.getWeightData(this.pageEvent);
  }

  selectResult(event, e) {
    this.dataSource.data.forEach((element) => {
      if (element.weightDataId === event.weightDataId) {
        element.checked = e.checked;
      }
    });
  }

  sortingArr(list: any[]) {
    const sortedArray: any[] = list.sort((obj1, obj2) => {
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

  getWeightData(pageEvent: PageEvent) {
    this.loading.show();
    let request = new inquiryWeightDestination();
    request.weightId =  this.data.data1.weightId;
    request.weightDataId =  this.data.data2.weightDataId;
    request.weightCode = this.weightCode;
    request.weightName = this.weightName;
    request.group = this.weightGroup;
    this.weightService
    this.weightService
      .inquiryWeightDestination(
        request,
        pageEvent.pageIndex,
        pageEvent.pageSize,
      )
      .subscribe((res) => {
        this.loading.hide();
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSourceCpip = new MatTableDataSource(res.content);
        this.noDataSource = this.dataSource.data.length == 0 ? true : false;
        this.length = res.totalRecords;
      });
  }

  search() {
    this.getWeightData(this.pageEvent);
    this.paginator.firstPage();
  }

  pageChange(e) {
    this.pageEvent = e;
    this.getWeightData(e);
    return e;
  }

  cal() {
    let sumPercent = 0;
    this.dataResult.forEach((element) => {
      sumPercent += element.adjustedWeight;
    });
    if (sumPercent <= 0) {
      // this.warningSwal.title = 'กรุณาเลือกข้อมูลปลายทาง';
      // this.warningSwal.show();
    } else {
      const weightParent: number = this.data.data2.adjustedWeight;
      let sumWeight = 0;
      let sumPercentTest = 0;
      this.dataResult.forEach((element) => {
        const percent: number = element.adjustedWeight / sumPercent;
        sumPercentTest += percent;
        const weight: number = weightParent * percent;
        const adjustWeight = parseFloat(weight.toFixed(5));
        sumWeight += adjustWeight;
        const data = {
          weightDataId: element.weightDataId,
          giveWeight: adjustWeight,
        };
        this.reqWeightDataId.listData.push(data);
      });
      if (parseFloat(sumWeight.toFixed(5)) === weightParent) {
        console.log('=');
      } else if (parseFloat(sumWeight.toFixed(5)) !== weightParent) {
        const diffWeight: number =
          weightParent - parseFloat(sumWeight.toFixed(5));
        const lastIndex = this.reqWeightDataId.listData.length - 1;
        const arrWeight = this.reqWeightDataId.listData[lastIndex].adjustWeight;
        const weight: number = arrWeight + parseFloat(diffWeight.toFixed(5));
        this.reqWeightDataId.listData[lastIndex].adjustWeight = parseFloat(
          weight.toFixed(5),
        );
        sumWeight += parseFloat(diffWeight.toFixed(5));
        if (parseFloat(sumWeight.toFixed(5)) === weightParent) {
        }
      }
    }
  }

  onSave() {
    this.loading.show();
    let request = new OtherActionWeightDataRequest();
    request.action = this.data.data3.paramInfo;
    request.weightDataId = this.data.data2.weightDataId;
    request.weightId = this.data.data1.weightId;
    let countWeight = 0;
    this.dataSource.data.forEach((element) => {
      if (element.checked != null && element.checked) {
        let weightDestination = new WeightActionData();
        weightDestination.weightDataId = element.weightDataId;
        countWeight = countWeight + element.adjustedWeight;
        request.weightDataDestination.push(weightDestination);
      }
    });
    if(countWeight === 0){
      this.loading.hide();
      this.warningSwal.show();
      return;
    }
    this.weightService.weightAction(request).subscribe((res) => {
      this.loading.hide();
      if (res.code === '200') {
        this.openDialog(res.data);
      } else {
      }
    });
  }

  cancel(status) {
    this.dialogRef.close(status);
  }

  openDialog(weightAfter: number): void {
    let request = {data: this.data.data4, weightAfter: weightAfter};
    const dialogRef = this.dialog.open(DialogCompareWeightComponent, {
      width: '40%',
      data: request,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef.close(true);
    });
  }
}
