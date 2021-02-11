import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-history-step',
  templateUrl: './history-step.component.html',
  styleUrls: ['./history-step.component.scss']
})
export class HistoryStepComponent implements OnInit {

  displayedColumns: string[] = ['weightCode', 'description', 'action', 'adjustedWeight'];
  dataSource: MatTableDataSource<any>;
  dataResult = new Array();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loading: NgxSpinnerService,
    public dialogRef: MatDialogRef<HistoryStepComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.dataSource = this.data.data1;
  }
  cancel(status) {
    this.dialogRef.close(status);
  }

}
