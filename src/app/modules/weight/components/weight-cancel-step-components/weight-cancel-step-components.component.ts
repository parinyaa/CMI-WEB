import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { DialogCancelWeightStepComponent } from '../dialog-cancel-weight-step/dialog-cancel-weight-step.component';

@Component({
  selector: 'app-weight-cancel-step-components',
  templateUrl: './weight-cancel-step-components.component.html',
  styleUrls: ['./weight-cancel-step-components.component.scss']
})
export class WeightCancelStepComponentsComponent implements OnInit {

  @Input() currentStep;
  @Input() weight;
  isLoadingStep = true;
  dataWeightStep = new Array();
  dataSourceWeightStep = new MatTableDataSource();
  dataSourceStepHistory = new MatTableDataSource();
  step;
  txtShow = '';

  displayedColumnsResult: string[] = ['no', 'destinationCode', 'destinationSubcode', 'description', 'adjustweight'];

  constructor(
    private dialog: MatDialog,
    private loading: NgxSpinnerService,
    private weightService: WeightService,
  ) { }

  ngOnInit() {
    console.log('init cancel', this.weight, this.currentStep);
    this.getWeightStepByBaseYear(this.currentStep);
    if (this.currentStep == 1.1) {
      this.txtShow = 'ไม่มีขั้นตอนการลบสาขา';
    }
    else if (this.currentStep == 1.2 || this.currentStep == 2.1) {
      this.txtShow = 'ไม่มีขั้นตอนการยุบสาขา';
    }
  }

  getWeightStepByBaseYear(currentStep: number) {
    this.loading.show();
    this.weightService.getWeightStepByBaseYear(this.weight.weightId, currentStep).subscribe(res => {
      this.dataWeightStep = res;
      let firstEdit = false;
      this.dataWeightStep.forEach(element => {
        if (element.status == 'NEW') {
          if (!firstEdit) {
            element.isCancel = true;
            firstEdit = true;
          }
          else {
            element.isEdit = false;
          }
        }
      });
      this.dataSourceWeightStep = new MatTableDataSource(this.dataWeightStep);
      this.loading.hide();
    },
      (error) => {
        this.loading.hide();
      });
  }

  getWeightHistory(element, itemIndex) {
    this.step = itemIndex;
    this.loading.show()
    this.weightService.getWeightHistoryByWeightStep(element.weightStepId).subscribe((res) => {
      this.loading.hide();
      this.dataSourceStepHistory = new MatTableDataSource(res);
    },
      (error) => {
        this.loading.hide();
      });
  }

  openCancleStepDialog(element) {
    let data = {
      weightStep: element,
    }
    const dialogRef = this.dialog.open(DialogCancelWeightStepComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWeightStepByBaseYear(this.currentStep);
    });
  }

}
