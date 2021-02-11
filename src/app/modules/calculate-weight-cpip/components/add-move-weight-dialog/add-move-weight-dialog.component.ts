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
import {inquiryWeightDestination} from 'src/app/shared/models/weight/request/WeightMapping';

@Component({
  selector: 'app-add-move-weight-dialog',
  templateUrl: './add-move-weight-dialog.component.html',
  styleUrls: ['./add-move-weight-dialog.component.scss'],
})
export class AddMoveWeightDialogComponent implements OnInit {
  @ViewChild(MatPaginator, {static:false}) paginator : MatPaginator;
  displayedColumns: string[] = [
    'action',
    'weightCode',
    'description',
    'adjustedWeight',
  ];
  dataSource: MatTableDataSource<any>;
  dataResult: any;
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
  dataSourceCpip: MatTableDataSource<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddMoveWeightDialogComponent>,
    private dialog: MatDialog,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    console.log(this.data.data1);
    console.log('data ==== ', this.data);
    this.getWeightData(this.pageEvent);
  }

  selectResult(data, event) {
    this.dataSource.data.forEach((element) => {
      const tmp: any = element;
      if (tmp.weightDataId !== data.weightDataId) {
        tmp.checked = false;
      } else {
        if (event.checked) {
          tmp.checked = true;
          this.dataResult = tmp;
        } else {
          tmp.checked = false;
          this.dataResult = undefined;
        }
      }
      element = tmp;
    });
  }

  getWeightData(pageEvent: PageEvent) {
    this.loading.show();
    let request = new inquiryWeightDestination();
    request.weightId = this.data.data1.weightId;
    request.weightDataId = this.data.data2.weightDataId;
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
        // this.search()
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

  onSave() {
    this.loading.show();
    let request = new OtherActionWeightDataRequest();
    request.action = this.data.data3.paramInfo;
    request.weightDataId = this.data.data2.weightDataId;
    request.weightId = this.data.data1.weightId;
    let weightDestination = new WeightActionData();
    weightDestination.weightDataId = this.dataResult.weightDataId;
    request.weightDataDestination.push(weightDestination);
    this.weightService.weightAction(request).subscribe((res) => {
      this.loading.hide();
      if (res.code === '200') {
        this.openDialog(res.data);
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
