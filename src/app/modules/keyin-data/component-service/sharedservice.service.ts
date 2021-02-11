import { DisableKeyIn } from './../../../shared/models/dataenty/request/DisableKeyIn';
import { CurrencyService } from 'src/app/core/service/currency/currency.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { element, logging } from 'protractor';
import { Injectable } from '@angular/core';
import { PriceDataList } from '../../../shared/models/dataenty/request/PricDataList';
import { PriceData } from '../../../shared/models/dataenty/request/PriceData';
import { DialogCheckpriceComponent } from '../component/dialog-checkprice/dialog-checkprice.component';
import { PricedataService } from '../../../core/service/pricedata/pricedata.service';
import { SessionServiceService } from '../../../core/service/common/session-service.service';
import { MatDialog } from '@angular/material';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SharedserviceService {
  monthlyData: any;
  provinceId: number;
  linkFlag: any;
  priceDataList: PriceDataList;
  frequencyType: string;
  currencyUnitList = new Array();
  imputationList = new Array();
  currencyRate = new Array();
  disableKeyIn = new DisableKeyIn();
  constructor(
    public pricedataService: PricedataService,
    public sessionService: SessionServiceService,
    public loading: NgxSpinnerService,
    public currencyService: CurrencyService,
    private dialog: MatDialog,
  ) { }
  public setState(monthlydata: any, provinceId: number, linkFlag: any, priceDataList: PriceDataList,
    frequencyType: string, currencyUnitList: Array<any>, imputationList: Array<any>, currencyRate: Array<any> ,disableKeyIn:DisableKeyIn): void {
    this.monthlyData = monthlydata;
    this.provinceId = provinceId;
    this.linkFlag = linkFlag;
    this.priceDataList = priceDataList;
    this.frequencyType = frequencyType;
    this.currencyUnitList = currencyUnitList;
    this.imputationList = imputationList;
    this.currencyRate = currencyRate;
    this.disableKeyIn = disableKeyIn;
  }
  public onCheckPriceDataEnty() {
    this.priceDataList = new PriceDataList();
    let currencyFlag = true;
    let validatePrice = { currentPriceIsNull: [], cfLimit: [], percentChange: [], rel: [], notPrice: [], errorFlag: false };
    this.monthlyData.forEach(element => {
      const priceData: PriceData = new PriceData();
      priceData.baseYearId = element.baseYearId;
      priceData.monthTerm = element.monthTerm;
      priceData.answerCommentFlag = element.answerCommentFlag;
      priceData.yearTerm = element.yearTerm;
      priceData.dataMatrixId = element.dataMatrixId;
      priceData.previousCalculatedPrice = element.previousCalculatedPrice;
      priceData.commentNote = element.commentNote;
      priceData.currencyRate = element.currencyRate;
      priceData.currencyUnit = element.currencyUnit;
      priceData.link = element.link;
      priceData.priceFlag = element.priceFlag;
      priceData.imputationFlag = element.imputationFlag;
      priceData.currentPrice = element.currentPrice;
      console.log("priceAdjust",element.priceAdjust) 
      console.log("element.currentAdjustedPrice",element.currentAdjustedPrice);
      if (element.priceAdjust || element.currentAdjustedPrice == null) {
        priceData.currentAdjustedPrice = element.currentPrice;
      } else {
        priceData.currentAdjustedPrice = element.currentAdjustedPrice;
      }
    
      priceData.currentCurrencyRate = 1;
      priceData.currentCalculatedPrice = priceData.currentAdjustedPrice;
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
      if (priceData.remark == '' || priceData.remark == null) {
        /// case currentPrice
        console.log("frequency", this.frequencyType);
        let currentPricePeriod = null;
        if (this.frequencyType === 'MONTHLY') {
          currentPricePeriod = priceData.currentPrice;
        }
        else if(this.frequencyType === 'WEEKLY'){
          console.log("  priceData.price1",  priceData.price1);
          console.log("  priceData.price2",  priceData.price2);
          console.log("  priceData.price3",  priceData.price3);
          console.log("  priceData.price4",  priceData.price4);
          if(!this.disableKeyIn.disablePrice1){
            currentPricePeriod = priceData.price1;
          }else if(!this.disableKeyIn.disablePrice2){
            currentPricePeriod = priceData.price2;
          }else if(!this.disableKeyIn.disablePrice3){
            currentPricePeriod = priceData.price3;
          }else if(!this.disableKeyIn.disablePrice4){
            currentPricePeriod = priceData.price4;
          }
        }
        console.log("currentPricePeriod",currentPricePeriod);
        if (currentPricePeriod == null || currentPricePeriod == 0 || isNaN(currentPricePeriod)) {
          validatePrice.currentPriceIsNull.push(element);
          validatePrice.errorFlag = true;
          element.notSavePrice = true;
        } else {
          element.notSavePrice = false;
        }

        /// case noOfCarrierForward
        const cf = this.imputationList.find(x => x.paramId == priceData.imputationFlag);
        if (cf) {
          if (cf.paramInfo == 'CARRIER_FORWARD' && cf.paramId != element.toggles.fakeImputation) {
            const noOfCarrierForward = priceData.noOfCarrierForward + 1;
            if (noOfCarrierForward >= element.noOfCarrierForwardLimit && element.noOfCarrierForwardLimit != null) {
              let obj = { 'data': element, 'value': noOfCarrierForward, 'valueDefault': element.noOfCarrierForwardLimit };
              validatePrice.cfLimit.push(obj);
              validatePrice.errorFlag = true;
              element.notSavePrice = true;
            }
          }
        }
        /// case percentChage
        console.log(priceData);
        if (priceData.currentAdjustedPrice > 0 && priceData.previousAdjustedPrice > 0) {
          const currentAdjustedPrice = priceData.currentAdjustedPrice;
          const previousAdjustedPrice = priceData.previousAdjustedPrice;
          console.log(priceData.currentAdjustedPrice, previousAdjustedPrice, (currentAdjustedPrice - previousAdjustedPrice) / previousAdjustedPrice);
          const percentChange = (currentAdjustedPrice - previousAdjustedPrice) / previousAdjustedPrice;
          const cal = percentChange * 100;
          let result = + cal.toFixed(2);
          if (result < 0) {
            result = result * -1;
          }
          if (result >= element.percentChange && element.percentChange != null) {
            let obj = { 'data': element, 'value': result, 'valueDefault': element.percentChange };
            validatePrice.percentChange.push(obj);
            validatePrice.errorFlag = true;
            element.notSavePrice = true;
          }
        }
        /// case rel != 100
        if (priceData.rel != null) {
          if (priceData.rel != 100) {
            let obj = { 'data': element, 'value': priceData.rel, 'valueDefault': 100 };
            validatePrice.rel.push(obj);
            validatePrice.errorFlag = true;
            element.notSavePrice = true;
          }
        }
        if (priceData.priceFlag === 'Y') {
          validatePrice.notPrice.push(element);
          validatePrice.errorFlag = true;
          element.notSavePrice = true;
        }
      } else {
        element.notSavePrice = false;
      }
      this.priceDataList.priceDataList.push(priceData);
      this.priceDataList.provinceId = this.provinceId;
    });
    if (!currencyFlag) {
      Swal.fire({
        title: 'ยังไม่มีอัตราการแลกเปลี่ยนคุณต้องการบันทึกข้อมูลหรือไม่?',
        type: 'warning',
        allowOutsideClick: false
      }).then((result) => {
        if (result) {
          if (validatePrice.errorFlag) {
            this.openCheckPrice(validatePrice);
          } else {
            this.onSaveDataEntry();
          }
        }
      })
    } else {
      if (validatePrice.errorFlag) {
        this.openCheckPrice(validatePrice);
      } else {
        this.onSaveDataEntry();
      }
    }
    // return this.monthlyData;
  }
  openCheckPrice(data): void {
    const dialogRef = this.dialog.open(DialogCheckpriceComponent, {
      width: '70%',
      height: 'auto',
      position: {
        top: '2%'
      },
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.onSaveDataEntry());
      }
    });
  }

  onSaveDataEntry() {
    console.log('priceDataList', this.priceDataList);
    console.log('disableKeyIn',this.disableKeyIn);
    this.loading.show();
    this.pricedataService.savePriceData(this.priceDataList).subscribe(
      (res) => {
        this.loading.hide();
        console.log(res);
        this.setIsSaved();
        Swal.fire("บันทึกข้อมูลสำเร็จ","",'success');
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  setIsSaved() {
    this.sessionService.setIsSaved(true);
  }
}
