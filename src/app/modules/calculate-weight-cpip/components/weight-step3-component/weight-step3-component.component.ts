import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  PageEvent,
} from '@angular/material';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {WeightCalculatorService} from 'src/app/core/service/weightcalculator/weight-calculator.service';
import {WeightCpipService} from 'src/app/core/service/weightcpip/weight-cpip.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AddMoveWeightDialogComponent} from '../add-move-weight-dialog/add-move-weight-dialog.component';
import {AddMoveWeighttwoDialogComponent} from '../add-move-weighttwo-dialog/add-move-weighttwo-dialog.component';
import {AddMoveWeightthreeDialogComponent} from '../add-move-weightthree-dialog/add-move-weightthree-dialog.component';
import {HistoryWeightComponent} from '../history-weight/history-weight.component';
import {ParamService} from 'src/app/core/service/param/param.service';
import {UpdateStepRequest} from 'src/app/shared/models/weight/request/UpdateStepRequest.model';

@Component({
  selector: 'app-weight-step3-component',
  templateUrl: './weight-step3-component.component.html',
  styleUrls: ['./weight-step3-component.component.scss'],
})
export class WeightStep3ComponentComponent implements OnInit {
  @Input() weight;
  displayedColumns: string[] = [
    'weightCode',
    'description',
    'weight',
    'adjustedWeight',
    'action',
  ];
  dataSource: MatTableDataSource<any>;
  paramInfoList = new Array();
  @ViewChild('warningSwal', {static: false}) warningSwal: SwalComponent;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  isEditStep = false;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();
  originalWeight: any;
  weightStepNo2: any;
  currentStep;
  stepNo = 3;
  getweightId: any;

  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 25, 100, 1000];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;
  filterWeightCode = 'NULL';
  constructor(
    private weightCalService: WeightCalculatorService,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    public dialog: MatDialog,
    private paramService: ParamService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    this.getWeightAction();
    this.getWeightData(this.pageEvent);
  }

  // getWeightData() {
  //   this.loading.show();
  //   this.weightService.getWeightDataMove(this.weight).subscribe(res => {
  //     this.loading.hide();
  //     if (res.code === '200') {
  //       this.dataSource = new MatTableDataSource(res.data);
  //       console.log('logdataweight3', res.data);
  //       this.dataSource.paginator = this.paginator;
  //       this.noDataSource = this.dataSource.data.length === 0 ? true : false;
  //     } else {

  //     }
  //   });
  // }

  getWeightData(pageEvent: PageEvent) {
    this.loading.show();
    console.log('logweeeee', this.weight);
    this.weightService
      .getWeightDataByWeightIdStep3(
        this.weight.weightId,
        this.filterWeightCode,
        pageEvent.pageIndex,
        pageEvent.pageSize,
      )
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.inquiryWeightData);
        this.noDataSource = this.dataSource.data.length == 0 ? true : false;
        this.length = res.totalElements;

        this.getweightId =
          res.inquiryWeightData[0].cpipTrWeightData.weightId.weightId;
        this.originalWeight =
          res.inquiryWeightData[0].cpipTrWeightData.weightId.originalWeight;
        this.weightStepNo2 =
          res.totalWeight != null
            ? res.totalWeight
            : res.listWeightData[0].cpipTrWeightData.weightId.weightStepNo2;
        this.stepNo = res.inquiryWeightData[0].cpipTrWeightData.weightId.stepNo;

        this.loading.hide();
      });
  }

  pageChange(e) {
    this.getWeightData(e);
    return e;
  }

  getWeightAction() {
    const paramInfo = this.paramService.getParamByGroup('WEIGHT_ACTION');
    this.paramInfoList = new Array();
    paramInfo.forEach((element) => {
      if (element.paramInfo !== 'DELETE') {
        this.paramInfoList.push(element);
      }
    });
  }
  changeModeEditWeight(step) {
    if (step === '1.1') {
      this.isEditStep = false;
      //this.getWeightId();
      this.getWeightAction();
      this.getWeightData(this.pageEvent);
    } else if (step === '1.2') {
      this.isEditStep = true;
    }
  }
  getWeightId() {
    console.log('logpagemove', this.weight);
    this.weightService.getWeightId(this.weight).subscribe((res) => {
      if (res.code === '200') {
        this.originalWeight = res.data.originalWeight;
        this.weightStepNo2 = res.data.weightStepNo2;
      } else {
      }
    });
  }

  checkNextStep(step) {
    if (step === '-3') {
      this.warningSwal.title =
      'คุณต้องการย้อนกลับไปทำงาน <br />ขั้นตอนก่อนหน้า <br />';
      this.warningSwal.show().then(
        (result) => {
          if (result.value) {
            this.loading.show();
            let req = new UpdateStepRequest();
            req.weightId = this.weight.weightId;
            this.weightService.toBackStep(req).subscribe((res) => {
              this.loading.hide();

              this.changeTabEvent.emit();
              this.changeWeightEvent.emit(res);
            });
          }
        },
        (error) => {
          this.loading.hide();
        },
      );
    } else if (step === '3') {
      this.warningSwal.title = 'คุณต้องการไปทำงานที่ขั้นตอนที่ 4 <br />';
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.callNextStep(step);
        }
      });
    }
  }

  callNextStep(step) {
    this.loading.show();
    let req = new UpdateStepRequest();
    req.weightId = this.weight.weightId;
    this.weightService.toNextStep(req).subscribe(
      (res) => {
        this.loading.hide();

        this.changeTabEvent.emit();
        this.changeWeightEvent.emit(res);
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  callBackStep(step) {
    this.loading.show();
    this.weightService.getWeightId(this.weight).subscribe(
      (res) => {
        this.loading.hide();
        if (res.code === '200') {
          this.currentStep = res.data.stepNo;

          if (step === '-3') {
            console.log('in');
            this.changeTabEvent.emit();
          }
          this.changeWeightEvent.emit(res.data);
        }
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  dialogAddMoveWeight(weight: any, item: any): void {
    const weightBeforeObj = this.dataSource.data.filter(
      (x) =>
        x.cpipTrWeightData.weightDataId ===
        (weight && weight.cpipTrWeightData && weight.cpipTrWeightData.parentId
          ? weight.cpipTrWeightData.parentId.weightDataId
          : null),
    );
    const weightBefore = weightBeforeObj.length > 0 ? weightBeforeObj[0] : null;
    if (item.paramInfo === 'COMBINE') {
      const dialogRef = this.dialog.open(AddMoveWeightDialogComponent, {
        width: '1500px',
        data: {
          data1: this.weight,
          data2: weight.cpipTrWeightData,
          data3: item,
          data4: weightBefore,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getWeightData(this.pageEvent);
        }
      });
    } else if (item.paramInfo === 'AVERAGE') {
      const dialogRef = this.dialog.open(AddMoveWeighttwoDialogComponent, {
        width: '1500px',
        data: {
          data1: this.weight,
          data2: weight.cpipTrWeightData,
          data3: item,
          data4: weightBefore,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getWeightData(this.pageEvent);
        }
      });
    } else if (item.paramInfo === 'PROPORTION') {
      const dialogRef = this.dialog.open(AddMoveWeightthreeDialogComponent, {
        width: '1500px',
        data: {
          data1: this.weight,
          data2: weight.cpipTrWeightData,
          data3: item,
          data4: weightBefore,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        if (result) {
          this.getWeightData(this.pageEvent);
        }
      });
    }
  }
  dialogHistory(weight: any): void {
    console.log('history');
    const dialogRef = this.dialog.open(HistoryWeightComponent, {
      width: '1500px',
      data: {data1: weight.histories},
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        console.log('close');
        this.getWeightData(this.pageEvent);
      }
    });
  }

  selectionChange(e) {
    this.paginator.firstPage();
    this.getWeightData(this.pageEvent);
  }
}
