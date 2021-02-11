import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {
  MatTableDataSource,
  MatPaginator,
  MatDialog,
  PageEvent,
} from '@angular/material';
import {WeightCpipService} from 'src/app/core/service/weightcpip/weight-cpip.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {ViewDeleteComponent} from '../view-delete/view-delete.component';
import {UpdateStepRequest} from 'src/app/shared/models/weight/request/UpdateStepRequest.model';
import {DialogDeleteWeightDataComponent} from 'src/app/modules/calculate-weight-cpip/components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import {InquiryWeightDeleteRequest} from 'src/app/shared/models/weight/request/InquiryWeightDeleteRequest';

@Component({
  selector: 'app-weight-step2-component',
  templateUrl: './weight-step2-component.component.html',
  styleUrls: ['./weight-step2-component.component.scss'],
})
export class WeightStep2ComponentComponent implements OnInit {
  @Input() weight;
  @ViewChild('warningSwal', {static: false}) warningSwal: SwalComponent;
  getDataNotImportant: FormGroup;
  displayedColumns: string[] = [
    'weightCode',
    'description',
    'weight',
    'adjustedWeight',
    'percent1',
    'percent2',
    'action',
  ];
  dataSource: MatTableDataSource<any>;
  coefficient: any;
  getweightId: any;
  submitted = false;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  currentStep;
  stepNo = 2;
  originalWeight: any;
  weightStepNo2: any;

  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 25, 100, 1000];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;

  percent1 = 0;
  percent2 = 0;
  percent3 = 0;
  percent4 = 0;
  percent5 = 0;

  sumPercent1 = 0;
  sumPercent2 = 0;
  sumPercent3 = 0;
  sumPercent4 = 0;
  sumPercent5 = 0;

  countPercent1 = 0;
  countPercent2 = 0;
  countPercent3 = 0;
  countPercent4 = 0;
  countPercent5 = 0;

  actionDelete: string = 'DELETE';
  filterWeightCode = 'NULL';
  constructor(
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private FormBuild: FormBuilder,
    private router: Router,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    //this.getWeightId();
    this.getWeightData(this.pageEvent);
    this.setFormTransaction();
  }

  setFormTransaction() {
    this.getDataNotImportant = this.FormBuild.group({
      coefficient: ['', Validators.required],
    });
  }

  // onSubmit() {
  //   console.log(this.getDataNotImportant);
  //   this.submitted = true;
  //   if (this.getDataNotImportant.invalid) {
  //     return;
  //   } else {
  //     this.onSave();

  //   }
  // }

  updateWeight(e) {
    console.log('qqqqqqq' + e);
    this.weight = e;
    this.getWeightData(this.pageEvent);
  }
  // getWeightData() {
  //   this.loading.show();
  //   this.weightService.getWeightData(this.weight).subscribe(res => {
  //     this.loading.hide();
  //     if (res.code === '200') {
  //       this.dataSource = new MatTableDataSource(res.data.listWeightData);
  //       this.dataSource.paginator = this.paginator;
  //       this.noDataSource = this.dataSource.data.length === 0 ? true : false;
  //       console.log('log-table-delete', this.dataSource);
  //     } else {

  //     }
  //   });
  // }

  getWeightData(pageEvent: PageEvent) {
    this.loading.show();
    console.log('logweeeee', this.weight);
    this.weightService
      .getWeightDataByWeightId(
        this.weight.weightId,
        this.stepNo,
        this.filterWeightCode,
        pageEvent.pageIndex,
        pageEvent.pageSize,
      )
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.listWeightData);
        this.noDataSource = this.dataSource.data.length == 0 ? true : false;
        this.length = res.totalElements;

        this.getweightId = res.listWeightData[0].weightId.weightId;
        this.originalWeight = res.listWeightData[0].weightId.originalWeight;
        this.weightStepNo2 =
          res.totalWeight != null
            ? res.totalWeight
            : res.listWeightData[0].weightId.weightStepNo1;
        console.log('log-table-adjust', this.dataSource);
        this.stepNo = res.listWeightData[0].weightId.stepNo;
        this.loading.hide();
        this.inquiryWeightDelete('percent1');
        this.inquiryWeightDelete('percent2');
      });
  }

  pageChange(e) {
    this.getWeightData(e);
    return e;
  }

  // onSave() {
  //   this.coefficient = this.getDataNotImportant.controls.coefficient.value;
  //   this.deleteDialog(this.weight, this.coefficient);
  // }

  // getWeightId() {
  //   this.loading.show();
  //   console.log('logstate', this.weight);
  //   this.weightService.getWeightId(this.weight).subscribe(res => {
  //     this.loading.hide();
  //     if (res.code === '200') {
  //       this.getweightId = res.data;
  //       console.log('weightId-getid', this.getweightId);
  //     } else {

  //     }
  //   });
  // }
  openDeleteDialog(row) {
    let data = {
      weight: this.weight,
      weightData: row,
      action: this.actionDelete,
    };
    const dialogRef = this.dialog.open(DialogDeleteWeightDataComponent, {
      width: '750px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getWeightData(this.pageEvent);
      }
    });
  }

  cancelDeleted() {
    this.loading.show();
    const dialogRef = this.dialog.open(ViewDeleteComponent, {
      width: '1000px',
      data: {weight: this.weight},
    });
    dialogRef.afterClosed().subscribe((result) => {
      // if (result) {
      this.getWeightData(this.pageEvent);
      // }
    });
  }
  checkNextStep(step) {
    if (step === '2') {
      this.warningSwal.title = 'คุณต้องการไปทำงานที่ขั้นตอนที่ 3 <br />';
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.callNextStep(step);
        }
      });
    } else if (step === '-2') {
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
    }
    // else if (step === '-2') {
    //   this.warningSwal.title =
    //     'คุณต้องการย้อนกลับไปทำงานขั้นตอนก่อนหน้า <br />';
    //   this.warningSwal.show().then(
    //     (result) => {
    //       if (result.value) {
    //         this.loading.show();
    //         this.weightService.getBackStep(this.weight).subscribe((res) => {
    //           this.loading.hide();
    //           this.callBackStep(step);
    //         });
    //       }
    //     },
    //     (error) => {
    //       this.loading.hide();
    //     },
    //   );
    // }
  }

  callNextStep(step) {
    this.loading.show();
    let req = new UpdateStepRequest();
    req.weightId = this.weight.weightId;
    req.egPercent = this.percent1;
    req.efPercent = this.percent2;
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

  inquiryWeightDelete(model: string) {
    let request = new InquiryWeightDeleteRequest();
    request.weightId = this.weight.weightId;
    request.percent = 0;

    if (model === 'percent1') {
      request.percent = this.percent1;
      request.type = 'EG';
    } else if (model === 'percent2') {
      request.percent = this.percent2;
      request.type = 'EF';
    } else if (model === 'percent3') {
      request.percent = this.percent3;
    } else if (model === 'percent4') {
      request.percent = this.percent4;
    } else if (model === 'percent5') {
      request.percent = this.percent5;
    }

    this.weightService.inquiryWeightDelete(request).subscribe(
      (res) => {
        if (model === 'percent1') {
          this.sumPercent1 = res.totalWeightDelete;
          this.countPercent1 = res.countWeight;
        } else if (model === 'percent2') {
          this.sumPercent2 = res.totalWeightDelete;
          this.countPercent2 = res.countWeight;
        } else if (model === 'percent3') {
          this.sumPercent3 = res.totalWeightDelete;
          this.countPercent3 = res.countWeight;
        } else if (model === 'percent4') {
          this.sumPercent4 = res.totalWeightDelete;
          this.countPercent4 = res.countWeight;
        } else if (model === 'percent5') {
          this.sumPercent5 = res.totalWeightDelete;
          this.countPercent5 = res.countWeight;
        }
      },
      (error) => {},
    );
  }

  callBackStep(step) {
    this.loading.show();
    this.weightService.getWeightId(this.weight).subscribe(
      (res) => {
        this.loading.hide();
        if (res.code === '200') {
          this.currentStep = res.data.stepNo;

          if (step === '-2') {
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

  weightCodeIsType(weightCode: string, type: string) {
    return weightCode.includes(type);
  }

  selectionChange(e) {
    this.paginator.firstPage();
    this.getWeightData(this.pageEvent);
  }
}
