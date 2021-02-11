import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { DialogCancelWeightStepComponent } from 'src/app/modules/calculate-weight/components/dialog-cancel-weight-step/dialog-cancel-weight-step.component';

@Component({
  selector: 'app-weight-cancel-step-components',
  templateUrl: './weight-cancel-step-components.component.html',
  styleUrls: ['./weight-cancel-step-components.component.scss']
})
export class WeightCancelStepComponentsComponent implements OnInit {

  @Input() weight;
  isLoadingStep = true;
  dataWeightStep = new Array();
  dataSourceWeightStep = new MatTableDataSource();
  dataSourceStepHistory = new MatTableDataSource();
  step;
  txtShow = '';
  currentStep = 1.1;

  displayedColumnsResult: string[] = ['no', 'destinationCode', 'description', 'adjustweight'];

  constructor(
    private dialog: MatDialog,
    private loading: NgxSpinnerService,
    private weightService: WeightService,
  ) { }

  ngOnInit() {
    console.log('init cancel', this.weight);
    this.getWeightStepByBaseYear(this.currentStep);
  }

  getWeightStepByBaseYear(currentStep: number) {
    this.loading.show();
    this.weightService.getWeightStepByBaseYear(this.weight, currentStep).subscribe(res => {
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
