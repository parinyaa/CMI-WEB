import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-result-decison',
  templateUrl: './dialog-result-decison.component.html',
  styleUrls: ['./dialog-result-decison.component.scss']
})
export class DialogResultDecisonComponent implements OnInit {

  workflowObj: any;

  constructor(
    public dialogRef: MatDialogRef<DialogResultDecisonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.workflowObj = this.data;
  }

}
