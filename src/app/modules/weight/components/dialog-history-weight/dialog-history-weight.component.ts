import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-dialog-history-weight',
  templateUrl: './dialog-history-weight.component.html',
  styleUrls: ['./dialog-history-weight.component.scss']
})
export class DialogHistoryWeightComponent implements OnInit {

  listHistory: any[];
  displayedColumns: string[] = ['no', 'weightCode', 'weightSubcode','weightName', 'status', 'weight'];
  dataSource = new MatTableDataSource();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogHistoryWeightComponent>,
  ) { }

  ngOnInit() {
    console.log(this.data.history);
    this.listHistory = this.data.history;
    this.dataSource = new MatTableDataSource(this.listHistory);
  }

}
