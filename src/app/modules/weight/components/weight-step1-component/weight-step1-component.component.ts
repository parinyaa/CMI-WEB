import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { PageEvent, MatTableDataSource, MatDialog, MatSelect } from '@angular/material';
import { DialogDeleteWeightDataComponent } from 'src/app/modules/weight/components/dialog-delete-weight-data/dialog-delete-weight-data.component';
import { DialogTypethirdcalComponent } from '../dialog-typethirdcal/dialog-typethirdcal.component';
import { DialogTypesecondcalComponent } from '../dialog-typesecondcal/dialog-typesecondcal.component';
import { DialogTypeonecalComponent } from '../dialog-typeonecal/dialog-typeonecal.component';
import { DialogHistoryWeightComponent } from '../dialog-history-weight/dialog-history-weight.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CalculateWeightNextStepRequest } from 'src/app/shared/models/weight/request/CalculateWeightNextStepRequest.model';
import { isEmpty } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { WeightPageComponent } from '../weight-page/weight-page.component';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-weight-step1-component',
  templateUrl: './weight-step1-component.component.html',
  styleUrls: ['./weight-step1-component.component.scss']
})
export class WeightStep1ComponentComponent implements OnInit, AfterViewInit {

  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;


  @Input() weight;
  @Input() paramList;
  @Output() changeTabEvent = new EventEmitter<any>();
  @Output() changeWeightEvent = new EventEmitter<any>();

  displayedColumns: string[] = ['weightCode', 'weightSubcode', 'description', 'weight', 'ratio', 'status', 'action'];
  displayedColumnsCalWeight: string[] = ['weightCode', 'weightSubcode', 'description', 'weight', 'action', 'history'];
  sumWeight = 0;
  totalWeight = 0;
  dataSource = new MatTableDataSource();
  deleteAction;
  weightCal = new Array();
  isEditStep = false;
  isEditStep2 = false;
  currentStep = 0;

  page = 0;
  size = 100;
  index = 0;
  isLoadingStep = false;
  isFirstStepDone = true;
  isSecondStepDone = false;
  firstFormGroup: FormGroup;

  length = 0;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;
  stepperIndex = 0;

  originalWeight = 0;


  constructor(
    private dialog: MatDialog,
    private loading: NgxSpinnerService,
    private weightService: WeightService,
    private calculateWeightNextStepRequest: CalculateWeightNextStepRequest,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.currentStep = this.weight.stepNo;
    this.getWeightDataByWeightId(1.1);
    this.getParamWeightCalType();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [this.currentStep == 1.1 ? '' : true, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.currentStep == 1.2) {
        this.myStepper.next();
      }
    }, 0);

  }

  getWeightDataByWeightId(step) {
    this.isLoadingStep = true;
    this.weightService.getWeightDataByWeightId(this.weight.weightId, this.page, this.size, step).subscribe((res) => {
      this.isLoadingStep = false;
      this.originalWeight = this.weight.originalWeight;
      this.sumWeight = this.weight.weightStepNo1_1;
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

  getParamWeightCalType() {
    this.paramList.forEach(element => {
      if (element.paramInfo != 'DELETE') {
        this.weightCal.push(element);
      }
      else {
        this.deleteAction = element
      }
    });
  }

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
        this.getWeightDataByWeightId(1.1);
      }
    });
  }

  selectionChangeStep1(event) {
    console.log(event);
    if (event.selectedIndex == 0) {
      this.page = 0;
      this.size = 100;
      this.getWeightDataByWeightId(1.1);
    }
    else if (event.selectedIndex == 1) {
      this.page = 0;
      this.size = 100;
      this.getWeightDataByWeightId(1.2);
    }
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
      data: { "value": value, "step": 1.2, 'actionId': event.value.paramId, 'weight': this.weight, }
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
    console.log(event);
    const dialogRef = this.dialog.open(DialogTypesecondcalComponent, {
      width: '750px',
      data: { "value": value, "step": 1.2, 'actionId': event.value.paramId, 'weight': this.weight }
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
      data: { "value": value, "step": 1.2, 'actionId': event.value.paramId, 'weight': this.weight }
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

  changeModeEditStep() {
    if (this.currentStep == 1.1) {
      this.isEditStep = true;
      this.isEditStep2 = false;
    }
    if (this.currentStep == 1.2) {
      this.isEditStep = false;
      this.isEditStep2 = true;
    }
  }

  openDataHistoryDialog(element) {
    console.log(element);
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

  checkNextStep(step) {
    if (step == 1.1 || step == 1.2) {
      if (step == 1.1) {
        this.warningSwal.title = "คุณต้องการไปทำงานที่ดำเนินการ <br />ยุบสาขาใช่หรือไม่";
      }
      else if (step == 1.2) {
        this.warningSwal.title = "คุณต้องการไปทำงานที่ขั้นตอนที่ 2 <br />ใช่หรือไม่";
      }
      this.warningSwal.show().then((result) => {
        if (result.value) {
          this.callNextStep(step);
        }
      });
    }
    else if (step == -1.2) {
      this.loading.show();
      this.weightService.getWeightStepByBaseYear(this.weight.weightId, step).subscribe(res => {
        this.loading.hide();
        if (res.length < 1) {
          this.warningSwal.title = "คุณต้องการย้อนกลับไปทำงาน <br />ที่ดำเนินการลบสาขาใช่หรือไม่";
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
      if (step == 1.1) {
        this.stepperIndex = 1;
        this.firstFormGroup.controls['firstCtrl'].setValue(true);
      }
      else if (step == 1.2) {
        this.changeTabEvent.emit();
      }
      else if (step == -1.2) {
        this.stepperIndex = 0;
        this.firstFormGroup.controls['firstCtrl'].setValue('');
      }
      this.changeWeightEvent.emit(res);
    },
      (error) => {
        this.loading.hide();
      });
  }

  changeModeEditWeight(step) {
    if (step == 1.1) {
      this.isEditStep = false;
    }
    else if (step == 1.2) {
      this.isEditStep2 = false;
    }
    this.getWeightDataByWeightId(step);
  }


}
