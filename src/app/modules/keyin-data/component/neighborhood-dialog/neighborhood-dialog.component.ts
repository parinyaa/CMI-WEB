import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, PageEvent} from '@angular/material';
import {PricedataService} from 'src/app/core/service/pricedata/pricedata.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Content, NeighborhoodResponse} from '../../model/neighborhoodResponse';
import {ParamService} from '../../../../core/service/param/param.service';
import {InboxDetail} from '../../../commodity-validate/models/inbox-details';
import {ParamInfo} from '../../../master-params/model/param';

@Component({
  selector: 'app-neighborhood-dialog',
  templateUrl: './neighborhood-dialog.component.html',
  styleUrls: ['./neighborhood-dialog.component.scss']
})
export class NeighborhoodDialogComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<InboxDetail>();
  displayedColumns: string[] = ['productCode', 'surveyName', 'previousAdjustedPrice', 'previousCalculatedPrice',
    'previousPrice', 'currentAdjustedPrice', 'currentCalculatedPrice', 'currentPrice', 'rel', 'action'];

  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  selectedData: InboxDetail = new InboxDetail();

  constructor(
    public dialogRef: MatDialogRef<NeighborhoodDialogComponent>,
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
    this.loadNeighborhoodPrice(cpaParentId, baseYearId, yearTerm, monthTerm, dataMatrixId, this.pageEvent);
  }

  public loadNeighborhoodPrice(cpaParentId: number, baseYearId: number, yearTerm: number,
                               monthTerm: number, dataMatrixId: number, pageEvent: PageEvent): void {
    this.loading.show();
    this.data.nonOwnList.forEach((x: InboxDetail) => {

      x.neighborHoodChecked = false;

    });
    this.dataSource = new MatTableDataSource(this.data.nonOwnList);
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
    this.loadNeighborhoodPrice(cpaParentId, baseYearId, yearTerm, monthTerm, dataMatrixId, e);
    return e;
  }

  selectRecord(event, data): void {
    console.log(data);
    data.neighborHoodChecked = event.checked;
    if (event.checked) {
      this.selectedData = data;
      this.data.selectedPrice = this.selectedData.currentAdjustedPrice;
    } else {
      this.selectedData = new InboxDetail();
      this.data.selectedPrice = 0;
    }
    this.deSelectRecord(data);
  }
  deSelectRecord(data: InboxDetail): void{
    const anotherRec = this.dataSource.data.filter( (x) => {
      const condition = x.dataMatrixIdPk !== data.dataMatrixIdPk;
      console.log('finding ', condition)
      return condition;
    });
    anotherRec.forEach( x => {
      x.neighborHoodChecked = false;
    });
  }
  selectPrice() {
    this.dialogRef.close(this.data.selectedPrice);
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
