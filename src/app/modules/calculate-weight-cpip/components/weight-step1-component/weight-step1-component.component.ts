import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatTableDataSource, MatPaginator, MatDialog, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightCpipService } from 'src/app/core/service/weightcpip/weight-cpip.service';
import { AddAdjustPweightDialogComponent } from '../add-adjust-pweight-dialog/add-adjust-pweight-dialog.component';
import { DialogDeleteWeightDataComponent } from 'src/app/modules/calculate-weight-cpip/components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamGroup } from 'src/app/shared/common/GetParam';
import { UpdateStepRequest } from 'src/app/shared/models/weight/request/UpdateStepRequest.model';

@Component({
  selector: 'app-weight-step1-component',
  templateUrl: './weight-step1-component.component.html',
  styleUrls: ['./weight-step1-component.component.scss']
})
export class WeightStep1ComponentComponent implements OnInit {

  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  displayedColumns: string[] = ['weightCode', 'description', 'weight', 'adjustedWeight'];

  @Input() weight;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();
  dataSource: MatTableDataSource<any>;
  getweightId: any;
  originalWeight: any;
  weightStepNo1: any;
  currentStep;
  deleteAction: any;
  dataArrayFromDB: any[] = [];
  stepNo = 1;
  isEditStep = false;

  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 25, 100, 1000];
  length = 0;
  pageEvent: PageEvent = new PageEvent();
  noDataSource = false;
  filterWeightCode = "NULL";

  constructor(
    public dialog: MatDialog,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    private router: Router,
    private paramService: ParamService

  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    console.log(this.weight);
    this.getWeightData(this.pageEvent);
    // this.getWeightId();
    //this.getDeleteAction();
  }

  getWeightData(pageEvent: PageEvent) {
    this.loading.show();
    console.log('logweeeee', this.weight);
    this.weightService.getWeightDataByWeightId(this.weight.weightId, this.stepNo, this.filterWeightCode, pageEvent.pageIndex, pageEvent.pageSize).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.listWeightData);
      this.noDataSource = this.dataSource.data.length == 0 ? true : false;
      this.length = res.totalElements;
      if (res.listWeightData.length !== 0) {
        this.getweightId = res.listWeightData[0].weightId.weightId;
        this.originalWeight = res.listWeightData[0].weightId.originalWeight;
        this.weightStepNo1 = res.totalWeight != null ? res.totalWeight : res.listWeightData[0].weightId.originalWeight;
        console.log('log-table-adjust', this.dataSource);
        this.stepNo = res.listWeightData[0].weightId.stepNo;
      }
      this.loading.hide();
    });
  }



  pageChange(e) {
    this.getWeightData(e);
    return e;
  }
  getWeightDataFromDB(step: number) {
    this.loading.show();
    this.weightService.getWeightAndWeightDataByBaseYear(this.getweightId, step).subscribe((res) => {
      this.dataArrayFromDB = [];
      //this.isLoadingStep = false;
      if (res.listWeightData) {
        //this.currentWeight = res.listWeightData[0].weightId;
        //this.checkDisableTab(res.listWeightData[0].weightId.stepNo);
        //this.totalWeight = 0;
        // res.listWeightData.forEach(element => {
        //   this.dataArrayFromDB.push({
        //     'weightCode': element.weightCode,
        //     'weight': parseFloat(element.adjustedWeight),
        //     'weightDataId': element.weightDataId,
        //     'weightSubcode': element.weightSubcode,
        //     'description': element.description,
        //     'listHistory': element.listHistory,
        //     'status': element.status
        //   });
        // });
        this.weightStepNo1 = res.totalWeight;
        this.currentStep = res.listWeightData[0].weightId.stepNo;
        this.originalWeight = res.listWeightData[0].weightId.originalWeight;
        this.dataSource = new MatTableDataSource(res.listWeightData);
        //this.dataSource.paginator = this.paginator;
        this.noDataSource = this.dataSource.data.length === 0 ? true : false;
        //this.length = res.totalElements;
      }
      this.loading.hide();
    },
      (error) => {
        console.log(error)
        //this.isLoadingStep = false;
      });
  }

  getWeightId() {
    this.loading.show();
    console.log('logweeeee2', this.weight);
    this.weightService.getWeightId(this.weight).subscribe(res => {
      this.loading.hide();
      if (res.code === '200') {
        this.getweightId = res.data;
        this.originalWeight = res.data.originalWeight;
        this.weightStepNo1 = res.data.weightStepNo1;
        console.log('wegihtstep1', this.originalWeight);
        console.log('weightId', this.getweightId);

      } else {

      }
    });
  }
  dialogAddAdjustPweight(): void {
    console.log('show add dialog');
    const dialogRef = this.dialog.open(AddAdjustPweightDialogComponent, {
      width: '750px',
      position: {
        top: '10%'
      },
      data: { value: this.weight.weightId },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        console.log('close');
        //this.getWeightData();
        this.getWeightData(this.pageEvent);
      }
    });
  }
  checkNextStep(step) {
    if (step === '2') {
      this.warningSwal.title = 'คุณต้องการไปทำงานที่ขั้นตอนต่อไป <br />';
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
    this.weightService.toNextStep(req).subscribe((res) => {
      this.loading.hide();

      this.changeTabEvent.emit();
      this.changeWeightEvent.emit(res);

    },
      (error) => {
        this.loading.hide();
      });
  }

  changeModeEditStep() {
    this.isEditStep = !this.isEditStep;

    if (!this.isEditStep) {
      //this.getWeightData();
    }
  }

  // toNextStep2(){
  //   this.weightService.toNextStep2(this.weight).subscribe((res) => {
  //     this.loading.hide();
  //     if (res.code === '200'){
  //       console.log("To next step2 success");

  //       this.changeTabEvent.emit();
  //       this.changeWeightEvent.emit(res.data);
  //     }
  //   },
  //     (error) => {
  //       this.loading.hide();
  //     });
  // }

  openDeleteDialog(element) {
    let data = {
      weight: element,
      action: this.deleteAction
    }
    const dialogRef = this.dialog.open(DialogDeleteWeightDataComponent, {
      width: '750px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWeightDataFromDB(1.1);
      }
    });
  }

  getDeleteAction() {
    this.deleteAction = this.paramService.getParamByGroup(ParamGroup.weightAction).find(e => e.paramInfo === "DELETE");
  }
}
