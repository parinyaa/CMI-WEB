import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSort, MatTableDataSource, PageEvent} from '@angular/material';
import {PricedataService} from '../../../../core/service/pricedata/pricedata.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Content} from '../../model/neighborhoodResponse';
import {InboxDetail} from '../../../commodity-validate/models/inbox-details';
import {ParamService} from '../../../../core/service/param/param.service';
import {ParamInfo} from '../../../master-params/model/param';

@Component({
  selector: 'app-average-percentage',
  templateUrl: './average-percentage.component.html',
  styleUrls: ['./average-percentage.component.scss']
})
export class AveragePercentageComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<InboxDetail>();
  displayedColumns: string[] = ['productCode', 'surveyName', 'previousAdjustedPrice', 'previousCalculatedPrice',
    'previousPrice', 'currentAdjustedPrice', 'currentCalculatedPrice', 'currentPrice', 'rel', 'action'];

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();

  selectedPrice = Array<InboxDetail>();
  rel = 0;

  constructor(
    public dialogRef: MatDialogRef<AveragePercentageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pricedataService: PricedataService,
    private loading: NgxSpinnerService,
    public paramService: ParamService
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    const cpaParentId = this.data.cpaParentId;
    const baseYearId = this.data.baseYearId;
    const yearTerm = this.data.yearTerm;
    const monthTerm = this.data.monthTerm;
    const dataMatrixId = this.data.dataMatrixId;
    this.loadAveragePercentagePrice(cpaParentId, baseYearId, yearTerm, monthTerm, dataMatrixId, this.pageEvent);
  }
  public loadAveragePercentagePrice(cpaParentId: number, baseYearId: number, yearTerm: number,
                                    monthTerm: number, dataMatrixId: number, pageEvent: PageEvent): void {
    this.loading.show();

    this.data.nonOwnList.forEach((x: InboxDetail) => {

      x.neighborHoodChecked = false;

    });
    this.dataSource = new MatTableDataSource<InboxDetail>(this.data.nonOwnList);
    this.length = this.data.nonOwnList.length;
    this.pageEvent.length = this.data.nonOwnList.length;
    this.loading.hide();

  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    const cpaParentId = this.data.cpaParentId;
    const baseYearId = this.data.baseYearId;
    const yearTerm = this.data.yearTerm;
    const monthTerm = this.data.monthTerm;
    const dataMatrixId = this.data.dataMatrixId;
    this.loadAveragePercentagePrice(cpaParentId, baseYearId, yearTerm, monthTerm, dataMatrixId, e);
    return e;
  }

  calAverageRel(): number {
    let result = 1;
    console.log(this.selectedPrice);
    if (this.selectedPrice.length > 0) {
      this.selectedPrice.forEach( x => {
        const rel = null != x.rel ? x.rel : 1;
        result = result * rel;
      });
      result = Math.pow(result, (1 / this.selectedPrice.length));
    }
    console.log('rel ', result);
    return result;
  }

  selectPrice(): void {
    this.rel = this.calAverageRel();
    this.dialogRef.close(this.rel);
  }

  itemToggle(event, data) {
    console.log((event));
    const finded = this.selectedPrice.find( f => {
      return f.baseYearIdPk === data.baseYearId && f.yearTermPk === data.yearTerm
        && f.monthTermPk === data.monthTerm && f.dataMatrixIdPk === data.dataMatrixId;
    });
    if (!finded) {
      this.selectedPrice.push(data);
    } else {
      if (!event.checked) {
        const index = this.selectedPrice.indexOf(finded);
        this.selectedPrice.splice(index, 1);
      }
    }
    this.rel = this.calAverageRel();
    console.log(this.selectedPrice);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getCurrencyLabel(currencyUnit: number): string {
    let result = '-';
    const param: ParamInfo = this.paramService.getParamByGroupCodeAndParamId('CURRENCY_UNIT', currencyUnit);
    if (param) {
      result = param.paramLocalMessage;
    }
    return result;
  }
}
