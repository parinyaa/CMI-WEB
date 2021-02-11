import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WeightCpipService } from 'src/app/core/service/weightcpip/weight-cpip.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-history-weight',
  templateUrl: './history-weight.component.html',
  styleUrls: ['./history-weight.component.scss']
})
export class HistoryWeightComponent implements OnInit {

  displayedColumns: string[] = ['weightCode', 'description', 'action', 'adjustedWeight'];
  dataSource: MatTableDataSource<any>;
  dataResult = new Array();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightCpipService,
    private loading: NgxSpinnerService,
    public dialogRef: MatDialogRef<HistoryWeightComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data.data1[0].destination);
    this.dataSource = this.data.data1;

  }

  cancel(status) {
    this.dialogRef.close(status);
  }

}
