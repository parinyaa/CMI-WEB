import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialog-compare-weight',
  templateUrl: './dialog-compare-weight.component.html',
  styleUrls: ['./dialog-compare-weight.component.scss'],
})
export class DialogCompareWeightComponent implements OnInit {
  title: string = '';
  weightBefore: number;
  weightAfter: number;
  constructor(
    public dialogRef: MatDialogRef<DialogCompareWeightComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    const weight = this.data ? this.data : null;
    if (weight && weight.data && weight.data.cpipTrWeightData) {
      this.title =
        weight.data.cpipTrWeightData.weightCode +
        ' ' +
        weight.data.cpipTrWeightData.description;
      this.weightBefore = weight.data.cpipTrWeightData.adjustedWeight;
      this.weightAfter = weight.weightAfter;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
