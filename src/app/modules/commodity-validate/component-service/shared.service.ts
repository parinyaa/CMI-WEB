import {Injectable} from '@angular/core';
import {PriceDataList} from '../../../shared/models/dataenty/request/PricDataList';
import {PricedataService} from '../../../core/service/pricedata/pricedata.service';
import {SessionServiceService} from '../../../core/service/common/session-service.service';
import {MatDialog} from '@angular/material';
import {PriceData} from '../../../shared/models/dataenty/request/PriceData';
import {DialogCheckpriceComponent} from '../../keyin-data/component/dialog-checkprice/dialog-checkprice.component';
import {InboxDetail} from '../models/inbox-details';
import {ParamService} from '../../../core/service/param/param.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  monthlyData: any;
  linkFlag: any;
  priceDataList: PriceDataList;
  frequencyType: string;
  currencyUnitList = new Array();
  imputationList = new Array();
  sucesssaveDataSwal: SwalComponent;
  provinceId: number;
  constructor(
    private pricedataService: PricedataService,
    private sessionService: SessionServiceService,
    private paramService: ParamService,
    private dialog: MatDialog,
    private loading: NgxSpinnerService,
  ) {}

  public setState(
    monthlydata: Array<InboxDetail>,
    swal: SwalComponent,
    loading: NgxSpinnerService,
    provinceId: number,
  ): void {
    this.monthlyData = monthlydata;
    this.sucesssaveDataSwal = swal;
    this.loading = loading;
    this.provinceId = provinceId;
  }

  public onCheckPriceDataEnty() {
    if (this.loading) {
      this.loading.show();
    }
    this.priceDataList = new PriceDataList();
    this.monthlyData.forEach((element: InboxDetail) => {
      const priceData: PriceData = new PriceData();
      priceData.baseYearId = element.baseYearIdPk;
      priceData.monthTerm = element.monthTermPk;
      priceData.answerCommentFlag = element.answerCommentFlag;
      priceData.yearTerm = element.yearTermPk;
      priceData.dataMatrixId = element.dataMatrixIdPk;
      priceData.previousCalculatedPrice = element.previousCalculatedPrice;
      priceData.commentNote = element.commentNote;
      priceData.currencyRate = element.currencyRate;
      priceData.priceFlag = element.priceFlag;
      priceData.currentCurrencyRate = element.currentCurrencyRate;
      priceData.currencyUnit = element.currencyUnit;
      priceData.link = element.link;
      priceData.currentPrice = element.currentPrice;
      priceData.imputationFlag = element.impute;
      priceData.currentAdjustedPrice = element.currentAdjustedPrice;
      priceData.currentCalculatedPrice = element.currentCalculatedPrice;
      priceData.noOfCarrierForward = element.noOfCarrierForward;
      priceData.previousAdjustedPrice = element.previousAdjustedPrice;
      priceData.previousPrice = element.previousPrice;
      priceData.relativeRatio = element.relativeRatio;
      priceData.rel = element.rel;
      priceData.remark = element.remark;
      priceData.requestCommentFlag = element.requestCommentFlag;
      priceData.usedFlag = element.usedFlag;
      priceData.price1 = element.price1;
      priceData.price2 = element.price2;
      priceData.price3 = element.price3;
      priceData.price4 = element.price4;
      this.priceDataList.priceDataList.push(priceData);
    });
    this.priceDataList.provinceId = this.provinceId;
    this.onSaveDataEntry();
  }

  public savePriceForInspect(): Observable<any> {
    this.priceDataList = new PriceDataList();
    this.monthlyData.forEach((element) => {
      const priceData: PriceData = new PriceData();
      priceData.baseYearId = element.baseYearIdPk;
      priceData.monthTerm = element.monthTermPk;
      priceData.answerCommentFlag = element.answerCommentFlag;
      priceData.yearTerm = element.yearTermPk;
      priceData.dataMatrixId = element.dataMatrixIdPk;
      priceData.previousCalculatedPrice = element.previousCalculatedPrice;
      priceData.commentNote = element.commentNote;
      priceData.currencyRate = element.currencyRate;
      priceData.currencyUnit = element.currencyUnit;
      priceData.link = element.link;
      priceData.currentPrice = element.currentPrice;
      priceData.imputationFlag = element.impute;
      priceData.currentAdjustedPrice = element.currentAdjustedPrice;
      priceData.currentCalculatedPrice = element.currentCalculatedPrice;
      priceData.noOfCarrierForward = element.noOfCarrierForward;
      priceData.previousAdjustedPrice = element.previousAdjustedPrice;
      priceData.previousPrice = element.previousPrice;
      priceData.relativeRatio = element.relativeRatio;
      priceData.rel = element.rel;
      priceData.remark = element.remark;
      priceData.requestCommentFlag = element.requestCommentFlag;
      priceData.usedFlag = element.usedFlag;
      priceData.price1 = element.price1;
      priceData.price2 = element.price2;
      priceData.price3 = element.price3;
      priceData.price4 = element.price4;
      this.priceDataList.priceDataList.push(priceData);
    });
    return this.onSavePriceForInspect();
  }

  private openCheckPrice(data): void {
    const dialogRef = this.dialog.open(DialogCheckpriceComponent, {
      width: '70%',
      height: 'auto',
      position: {
        top: '2%',
      },
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(this.onSaveDataEntry());
      }
    });
  }

  private onSaveDataEntry() {
    console.log('priceDataList', this.priceDataList);
    this.pricedataService.savePriceData(this.priceDataList).subscribe(
      (res) => {
        console.log(res);
        if (this.loading) {
          this.loading.hide();
        }
        if (this.sucesssaveDataSwal) {
          this.sucesssaveDataSwal.show();
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  private onSavePriceForInspect(): Observable<any> {
    console.log('priceDataList', this.priceDataList);
    return this.pricedataService.savePriceData(this.priceDataList);
  }
}
