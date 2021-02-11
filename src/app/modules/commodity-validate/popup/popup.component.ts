import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Compare} from '../models/inbox';
import {CompareCountRequest} from '../models/compare-count-request';
import {CommodityService} from '../../../core/service/commodity/commodity.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  compareSource: MatTableDataSource<Compare>;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commodityService: CommodityService
  ) {}

  ngOnInit() {
    console.log(this.data);
    const type: string = this.data.type;
    const param: CompareCountRequest = this.data.param;
    this.commodityService.getCompareCount(type, param).subscribe(
      (r: Compare[]) => {
        console.log(r);
        this.compareSource = new MatTableDataSource<Compare>(r);
      }
    );
  }

}
