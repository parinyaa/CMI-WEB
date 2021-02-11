import {NgxSpinnerService} from 'ngx-spinner';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component, OnInit, Inject} from '@angular/core';

@Component({
  selector: 'app-dialog-checkprice',
  templateUrl: './dialog-checkprice.component.html',
  styleUrls: ['./dialog-checkprice.component.scss']
})
export class DialogCheckpriceComponent implements OnInit {
  step = 0;
  displayedColumns: string[] = ['commodityCode', 'commodityName', 'source'];
  displayedColumnsLimt: string[] = ['commodityCode2', 'commodityName2', 'source2','limit','value'];
  priceIsNUll = new MatTableDataSource();
  cfLimit = new MatTableDataSource();
  percentChange = new MatTableDataSource();
  relChange = new MatTableDataSource();
  notPrice = new MatTableDataSource();
  constructor(
    public dialogRef: MatDialogRef<DialogCheckpriceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loading: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.setData();
    console.log('data', this.data);
  }

  setData() {
    if (this.data.currentPriceIsNull.length > 0) {
      this.priceIsNUll = new MatTableDataSource(this.data.currentPriceIsNull);
      console.log(this.priceIsNUll);
      this.step = 0;
    }
    if (this.data.cfLimit.length > 0) {
      this.cfLimit = new MatTableDataSource(this.data.cfLimit);
      this.step = 1;
    }
    if (this.data.percentChange.length > 0) {
      this.percentChange = new MatTableDataSource(this.data.percentChange);
      this.step = 2;
    }
    if(this.data.percentChange.length > 0){
       this.percentChange = new MatTableDataSource(this.data.percentChange);
       this.step = 2;
    }  
    if(this.data.rel.length > 0){
      this.relChange = new MatTableDataSource(this.data.rel);
      this.step = 3;
    }  
    if(this.data.notPrice.length > 0){
      this.notPrice = new MatTableDataSource(this.data.notPrice);
      this.step = 4;
    }  
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    this.dialogRef.close(true);
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  commodityCodeLabel(e): string {
    let result: null;
    if (e.parentCommodityCode) {
      result = e.parentCommodityCode;
    } else {
      if (e.commodityCode) {
        result = e.commodityCode;
      } else {
        result = e.dataMatrix.dataConfig.ppiMsCpa.commodityCode;
      }
    }
    return  result;
  }


  commodityCodeLabel3(e): string {
    let result: null;
    if (e.parentCommodityCode) {
      result = e.parentCommodityCode;
    } else {
      if (e.data.commodityCode) {
        result = e.data.commodityCode;
      } else {
        result = e.data.dataMatrix.dataConfig.ppiMsCpa.commodityCode;
      }
    }
    return  result;
  }

  commodityNameLabel(e): string {
    let result: null;
    if (e.parentCommodityThName) {
      result = e.parentCommodityThName;
    } else {
      if (e.commodityName) {
        result = e.commodityName;
      } else {
        result = e.dataMatrix.dataConfig.ppiMsCpa.commodityThName;
      }
    }
    return  result;
  }

  commodityNameLabel3(e): string {
    let result: null;
    if (e.parentCommodityThName) {
      result = e.parentCommodityThName;
    } else {
      if (e.data.commodityName) {
        result = e.data.commodityName;
      } else {
        result = e.data.dataMatrix.dataConfig.ppiMsCpa.commodityThName;
      }
    }
    return  result;
  }

  sourceNameLabel(e): string {
    let result: null;
    if (e.sourceName) {
      result = e.sourceName;
    } else {
      result = e.dataMatrix.dataConfig.ppiMsSource.sourceName;
    }
    return  result;
  }

  sourceNameLabel2(e): string {
    let result: null;
    if (e.surveyName) {
      result = e.surveyName;
    } else {
      if (e.data.sourceName) {
        result = e.data.sourceName;
      } else {
        result = e.data.dataMatrix.dataConfig.ppiMsSource.sourceName;
      }
    }
    return  result;
  }

}
