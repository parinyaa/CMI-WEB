import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, PageEvent, MatDialog, MatSelect } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { DialogTypethirdcalComponent } from '../dialog-typethirdcal/dialog-typethirdcal.component';
import { DialogTypesecondcalComponent } from '../dialog-typesecondcal/dialog-typesecondcal.component';
import { DialogTypeonecalComponent } from '../dialog-typeonecal/dialog-typeonecal.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DialogHistoryWeightComponent } from '../dialog-history-weight/dialog-history-weight.component';

@Component({
  selector: 'app-weight-step2-component',
  templateUrl: './weight-step2-component.component.html',
  styleUrls: ['./weight-step2-component.component.scss']
})
export class WeightStep2ComponentComponent implements OnInit {

  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;


  @Input() weight;
  @Input() paramList;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();

  length = 0;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  page = 0;
  size = 100;
  index = 0;
  isLoadingStep = false;


  sumWeight = 0;
  totalWeight = 0;
  isEditStep = false;
  dataSource = new MatTableDataSource();
  weightCal = new Array();
  displayedColumnsCalWeight: string[] = ['weightCode', 'weightSubcode', 'description', 'weight', 'action', 'history'];
  currentStep = 0;
  firstFormGroup: any;

  constructor(
    private dialog: MatDialog,
    private loading: NgxSpinnerService,
    private weightService: WeightService,
    private calculateWeightNextStepRequest: CalculateWeightNextStepRequest,
  ) { }

  ngOnInit() {
    this.currentStep = this.weight.stepNo;
    this.getWeightDataByWeightId(2.1);
    this.getParamWeightCalType();
  }

  getWeightDataByWeightId(step) {
    this.isLoadingStep = true;
    this.weightService.getWeightDataByWeightId(this.weight.weightId, this.page, this.size, step).subscribe((res) => {
      this.isLoadingStep = false;
      this.sumWeight = this.weight.weightStepNo1_2;
      this.totalWeight = res.totalWeight;
      this.dataSource = new MatTableDataSource(res.listWeightData);
      this.length = res.totalElements;
    });
  }

  pageChange(e: PageEvent, step: number): PageEvent {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getWeightDataByWeightId(step);
    return e;
  }

  changeModeEditStep() {
    this.isEditStep = true;
  }

  changeModeEditWeight(step) {
    this.isEditStep = false;
    this.getWeightDataByWeightId(step);
  }

  checkNextStep(step) {
    if (step == 2.1) {
      this.warningSwal.title = "คุณต้องการไปทำงานที่ขั้นตอนที่ 3 <br />ใช่หรือไม่";
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.callNextStep(step);
        }
      });
    }
    else if (step == -2.1) {
      this.loading.show();
      this.weightService.getWeightStepByBaseYear(this.weight.weightId, step).subscribe(res => {
        this.loading.hide();
        if (res.length < 1) {
          this.warningSwal.title = "คุณต้องการย้อนกลับไปทำงาน <br />ขั้นตอนที่ 1 ใช่หรือไม่";
          this.warningSwal.showCancelButton = true;
          this.warningSwal.show().then((result) => {
            if (result.value) {
              this.callNextStep(step);
            }
          });
        }
        else {
          this.warningSwal.title = "กรุณายกเลิกขั้นตอนการยุบสาขาทั้งหมด <br />เพื่อย้อนกลับไปทำงานขั้นตอนลบสาขา";
          this.warningSwal.showCancelButton = false;
          this.warningSwal.show();
        }
      },
        (error) => {
          this.loading.hide();
        });
    }
  }

  callNextStep(step) {
    this.calculateWeightNextStepRequest.stepId = step;
    this.calculateWeightNextStepRequest.weightId = this.weight.weightId
    this.loading.show();
    this.weightService.calculateWeightNextStep(this.calculateWeightNextStepRequest).subscribe((res) => {
      this.loading.hide();
      this.currentStep = res.stepNo;
      this.changeTabEvent.emit();
      this.changeWeightEvent.emit(res);
    },
      (error) => {
        this.loading.hide();
      });
  }


  getParamWeightCalType() {
    this.paramList.forEach(element => {
      if (element.paramInfo != 'DELETE') {
        this.weightCal.push(element);
      }
    });
  }

  onselectTypeCal(evt, value) {
    if (evt.value.paramInfo == "PROPORTION") {
      this.typeProportionCalWeight(evt, value);
    }
    else if (evt.value.paramInfo == "AVERAGE") {
      this.typeAverageCalWeight(evt, value);
    }
    else if (evt.value.paramInfo == "COMBINE") {
      this.typeCombineCalWeight(evt, value);
    }
  }

  typeProportionCalWeight(event, value) {
    const dialogRef = this.dialog.open(DialogTypethirdcalComponent, {
      width: '750px',
      data: { "value": value, "step": this.currentStep, 'actionId': event.value.paramId, 'weight': this.weight, }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWeightDataByWeightId(this.currentStep);
      }
      else {
        const matSelect: MatSelect = event.source;
        matSelect.writeValue(null);
      }
    });
  }

  typeAverageCalWeight(event, value) {
    const dialogRef = this.dialog.open(DialogTypesecondcalComponent, {
      width: '750px',
      data: { "value": value, "step": this.currentStep, 'actionId': event.value.paramId, 'weight': this.weight }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWeightDataByWeightId(this.currentStep);
      }
      else {
        const matSelect: MatSelect = event.source;
        matSelect.writeValue(null);
      }
    });
  }

  typeCombineCalWeight(event, value) {
    const dialogRef = this.dialog.open(DialogTypeonecalComponent, {
      width: '750px',
      data: { "value": value, "step": this.currentStep, 'actionId': event.value.paramId, 'weight': this.weight }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWeightDataByWeightId(this.currentStep);
      }
      else {
        const matSelect: MatSelect = event.source;
        matSelect.writeValue(null);
      }
    });
  }

  openDataHistoryDialog(element) {
    let data = {
      history: element.listHistory,
    }

    const dialogRef = this.dialog.open(DialogHistoryWeightComponent, {

      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}
