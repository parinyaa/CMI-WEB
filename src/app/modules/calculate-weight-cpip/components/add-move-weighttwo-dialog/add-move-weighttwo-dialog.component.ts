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

@Component({
  selector: 'app-add-move-weighttwo-dialog',
  templateUrl: './add-move-weighttwo-dialog.component.html',
  styleUrls: ['./add-move-weighttwo-dialog.component.scss'],
})
export class AddMoveWeighttwoDialogComponent implements OnInit {
  @ViewChild(MatPaginator, {static:false}) paginator : MatPaginator;
  displayedColumns: string[] = [
    'action',
    'weightCode',
    'description',
    'adjustedWeight',
  ];
  dataSource: MatTableDataSource<any>;
  dataSourceCpip: MatTableDataSource<any>;
  dataResult = new Array();
  reqWeightDataId = new RepWeightDataIdGive();
  filterCommodityCodeControl = new FormControl();
  filterCommodityNameControl = new FormControl();
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
    public dialogRef: MatDialogRef<AddMoveWeighttwoDialogComponent>,
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
    if (this.dataResult.length > 0) {
      const weightParent: number = this.data.data2.adjustedWeight;
      let weightChild = 0;
      let diffWeight = 0;
      const weight: number = weightParent / this.dataResult.length;
      const adjustWeight = parseFloat(weight.toFixed(5));

      this.sortingArr(this.dataResult).forEach((element) => {
        weightChild += adjustWeight;
        const data = {
          weightDataId: element.weightDataId,
          giveWeight: adjustWeight,
        };
        this.reqWeightDataId.listData.push(data);
      });
      if (weightChild !== weightParent) {
        const lastIndex = this.reqWeightDataId.listData.length - 1;
        diffWeight = weightParent - weightChild;
        const weightPlus: number = adjustWeight + diffWeight;
        this.reqWeightDataId.listData[lastIndex].giveWeight = parseFloat(
          weightPlus.toFixed(5),
        );
        weightChild += diffWeight;
      }
      if (weightChild === weightParent) {
        console.log('=');
      }
    }
  }

  onSave() {
    this.loading.show();
    let request = new OtherActionWeightDataRequest();
    request.action = this.data.data3.paramInfo;
    request.weightDataId = this.data.data2.weightDataId;
    request.weightId = this.data.data1.weightId;

    this.dataSource.data.forEach((element) => {
      if (element.checked != null && element.checked) {
        let weightDestination = new WeightActionData();
        weightDestination.weightDataId = element.weightDataId;
        request.weightDataDestination.push(weightDestination);
      }
    });

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
