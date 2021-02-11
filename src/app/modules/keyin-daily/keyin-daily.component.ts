import localeTh  from '@angular/common/locales/th';
import { DataEntyService } from 'src/app/core/service/dataenty/dataenty.service';
import { WorkFlowEntyRequest } from './../../shared/models/dataenty/request/WorkFlowRequest';
import { CurrencyService } from 'src/app/core/service/currency/currency.service';
import { AveragePercentageComponent } from './../keyin-data/component/average-percentage/average-percentage.component';
import { DialogCommentComponent } from './../keyin-data/component/dialog-comment/dialog-comment.component';
import { DialogCheckpriceComponent } from './../keyin-data/component/dialog-checkprice/dialog-checkprice.component';
import {element} from 'protractor';
import {NeighborhoodDialogComponent} from './../keyin-data/component/neighborhood-dialog/neighborhood-dialog.component';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {DailySaveRequest} from './../../shared/models/datadaily/DailySaveRequest';
import {ParamGroup} from 'src/app/shared/common/GetParam';
import {ParamService} from 'src/app/core/service/param/param.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {GetDataDailyRequest} from './../../shared/models/datadaily/GetDataDailyRequest';
import {KeydailyService} from './../../core/service/keydaily/keydaily.service';
import {MatTableDataSource} from '@angular/material/table';
import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatExpansionPanel} from '@angular/material';
import {SessionServiceService} from '../../core/service/common/session-service.service';
import { timeout } from 'rxjs/operators';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { registerLocaleData } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-keyin-daily',
  templateUrl: './keyin-daily.component.html',
  styleUrls: ['./keyin-daily.component.scss']
})
export class KeyinDailyComponent implements OnInit {
  @ViewChild('sucesssaveDataSwal', {static: false}) sucesssaveDataSwal: SwalComponent;
  @ViewChild('saveDailySwal', {static: false}) saveDailySwal: SwalComponent;
  @ViewChild('validateDataSwal', {static: false}) validateDataSwal: SwalComponent;
  step = -1;
  dataKey = new Array();
  displayedColumns: string[] = ['day', 'dailyName'];
  displayedColumnsSummary: string[] = ['cpaName', 'previousPrice', 'currentPrice','priceNot','rel', 'remark', 'action'];
  dataSource = new MatTableDataSource();
  dataSummary = new MatTableDataSource();
  dataHeader = new Array();
  data: Date;
  currentMonth: number;
  cpaName: string;
  cpaCode: string;
  matrixOnKey: any;
  imputationList: any;
  calCurrentPrice: number;
  typeUser = 1;
  parentId: number;
  inputKeyDaily:any;
  link: any;
  disablePrice1 : boolean;
  showButtonToTop = true;
  linkDisableInput = false;
  currencyList = new Array();
  currencyUnitList = new Array();
  frequencyList = new Array();
  workFlowList  = new Array();
  month = ['มกราคม ', 'กุมภาพันธ์ ', 'มีนาคม ', 'เมษายน ', 'พฤษภาคม ',
    'มิถุนายน ', 'กรกฎาคม ', 'สิงหาคม ', 'กันยายน ', 'ตุลาคม ', 'พฤศจิกายน ', 'ธันวาคม '];
  days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];

  constructor(
    private keydailyService: KeydailyService,
    private getDataDailyRequest: GetDataDailyRequest,
    private loading: NgxSpinnerService,
    private paramService: ParamService,
    private dailySaveRequest: DailySaveRequest,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private sessionService: SessionServiceService,
    private currencyService:CurrencyService,
    private dataentyService:DataEntyService
  ) {
    registerLocaleData(localeTh,'th');
  }

  ngOnInit() {
    const keyinParam = this.sessionService.getKeyinParam();
    console.log(keyinParam);
    // this.parentId = Number.parseInt(keyinParam.parentId);
    this.getCurrency();
    this.monthKey();
    // this.getDataDaily(this.parentId);
    this.paramService.getParamsGroupAll().subscribe(
      (res) => {
        this.getParams();
      }
    );
    this.getWorkFlow();
  }

  getParams() {
    this.imputationList = this.paramService.getParamByGroup(ParamGroup.imputation).sort((a, b) => a.orderNo - b.orderNo);
    this.frequencyList = this.paramService.getParamByGroup(ParamGroup.frequenct);
    if(this.imputationList){
      this.imputationList.forEach(element => {
        element.use = false;
        let x = this.sessionService.checkProfileIsContainObject(element.paramInfo);
        if (x) {
          element.use = true;
        }
      });
    }
    console.log(this.imputationList);
    this.currencyUnitList = this.paramService.getParamByGroup(ParamGroup.currencyUnit);
    this.link = this.paramService.getParamByGroup(ParamGroup.link).sort((a, b) => a.orderNo - b.orderNo);
    console.log(this.link);
  }

  getDataDaily(matrixId) {
    this.loading.show();
    this.getDataDailyRequest.parentCpaId = matrixId;
    this.getDataDailyRequest.frequency = 'DAILY';
    this.getDataDailyRequest.provinceId = JSON.parse(sessionStorage.getItem('userProfile')).provinceId;
    this.getDataDailyRequest.surveyId = JSON.parse(sessionStorage.getItem('userProfile')).surveyId;
    this.getDataDailyRequest.userType = JSON.parse(sessionStorage.getItem('userProfile')).userType;
    this.keydailyService.getDataDaily(this.getDataDailyRequest).subscribe(
      (res) => {
        this.loading.hide();
        console.log(res);
        if(res.length > 0){
          this.settingPreDaily(res);
        // res[0].toggles = {};
        // res[0].toggles.imputationFlag = this.setToggleImputation(res[0].link.paramCode);
        // res[0].toggles.currentPriceFlag = this.setToggleCurrentPrice(res[0].link.paramCode);
        // res[0].toggles.prevPriceFlag = this.setTogglePrevPrice(res[0].link.paramCode);
        // res[0].relativeRatio = this.setRelativeRatio(res[0].link.paramCode, res[0]);
        this.matrixOnKey = res;
        this.cpaName = res[0].dataMatrix.dataConfig.ppiMsCpa.commodityThName;
        this.cpaCode = res[0].dataMatrix.dataConfig.ppiMsCpa.commodityCode;
        this.dataHeader = res;
        // this.dataSummary = new MatTableDataSource(new Array(res[0]));
        console.log(this.dataHeader);
        }
      },
      (error) => {
        this.loading.hide();
      }
    );
  }

  settingPreDaily(data){
      data.forEach(element => {
        element.toggles = {};
        element.toggles.imputationFlag = this.setToggleImputation(element.link.paramCode);
        element.toggles.currentPriceFlag = this.setToggleCurrentPrice(element.link.paramCode);
        element.toggles.prevPriceFlag = this.setTogglePrevPrice(element.link.paramCode);
        element.relativeRatio = this.setRelativeRatio(element.link.paramCode, element);
        element.toggles.fakeImputation = element.imputationFlag;
        if(element.imputationFlag != null){
          element.toggles.imputationFlag  = true;
        }
      });
  }


  afterExpand(e){
    console.log(e);
    this.inputKeyDaily = e;
    if( this.inputKeyDaily.imputationFlag != null){
      this.linkDisableInput = true;
    }
    this.dataSummary = new MatTableDataSource(new Array(e));
  }

  getCountMonth() {
    const now = new Date();
    this.currentMonth = now.getMonth();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  monthKey() {
    this.dataKey = [];
    const checkerDate = new Date();
    checkerDate.setDate(1);
    if (checkerDate.getDay() !== 0) {
      const daysOfWeek = checkerDate.getDay();
      const thisMonth = checkerDate.getMonth();
      const thisYear = checkerDate.getFullYear();
      console.log(' daysOfWeek ' + daysOfWeek + ' thisMonth ' + thisMonth + ' thisYear ' + thisYear);
      console.log(' first day of month is ' + this.days[daysOfWeek]);
      const prevMonth = new Date();
      prevMonth.setDate(0);
      let daysOfPrevMonth = 0;
      if (thisMonth === 0) {
        const pYear = thisYear - 1;
        prevMonth.setFullYear(pYear, 11);
        daysOfPrevMonth = prevMonth.getDate();
      } else {
        const pMonth = thisMonth - 1;
        prevMonth.setMonth(pMonth);
        daysOfPrevMonth = prevMonth.getDate();
      }
      console.log("daysOfPrevMonth",daysOfPrevMonth,"daysOfWeek",daysOfWeek);
      for (let j = daysOfPrevMonth - daysOfWeek; j <= daysOfPrevMonth; j++) {
        let day = {};
        prevMonth.setDate(j);
        console.log("prevMonth.getDay",j,prevMonth.getDay());
        day = {day: j + ' เดือนที่แล้ว', holiday: true, dayLabel: this.days[prevMonth.getDay()]};
        this.dataKey.push(day);
      }
      console.log(this.dataKey);
    }

    const myDate = new Date();
    for (let i = 1; i <= this.getCountMonth(); i++) {
      let day = {};
      myDate.setDate(i);
      // if (myDate.getDay() === 5 || myDate.getDay() === 6) {
      //   day = {day: i, holiday: true, dayLabel: this.days[myDate.getDay()]};
      // } else {
      day = {day: i, holiday: false, dayLabel: this.days[myDate.getDay()]};
      // }
      this.dataKey.push(day);
    }
    this.dataSource = new MatTableDataSource(this.dataKey);
    console.log(this.dataKey);
  }

  onChangePriceNot(e, data) {
    console.log(e);
    const type = this.imputationList.find(x => x.paramId === e.value);
    if (type) {
      if (type.paramInfo === 'CARRIER_FORWARD') {
        this.linkDisableInput =  true;
        data.currentPrice = data.previousPrice;
        data.imputationFlag = type.paramId;
        data.toggles.imputationFlag = true;
      } else if (type.paramInfo === 'NEIGHBORHOOD_PRICE') {
        this.linkDisableInput =  true;
        data.imputationFlag = type.paramId;
        this.openNeighborhoodDialog(data);
      } else if (type.paramInfo === 'AVERAGE_PERCENT_CHANGE') {
        this.linkDisableInput =  true;
        data.imputationFlag = type.paramId;
        this.openAveragePercentageDialog(data);
      }
    } else {
      this.linkDisableInput =  false;
      data.imputationFlag = null;
      this.calCurrentPriceOnSave();
    }
    console.log(this.matrixOnKey);
  }

  calculateCurrentPrice(data) {
    let flag = data.imputationFlag.paramInfoId;
    if (flag == null) {
      flag = data.imputationFlag;
    }
    const findImpute = this.imputationList.find(x => x.paramId === flag);
    if (findImpute) {
      console.log(findImpute.paramInfo);
      if (findImpute.paramInfo === 'AVERAGE_PERCENT_CHANGE') {
        const prevPrice = data.previousPrice;
        const prevPriceAdjust = data.previousAdjustedPrice;
        const currentPrice = (prevPrice / prevPriceAdjust) * data.relativeRatio;
        data.currentPrice = currentPrice;
      }
    }
  }

  calCurrentPriceOnSave() {
    let sum = 0;
    let havePrice = 0;
      this.dataKey.forEach(day => {
        if (!day.holiday) {
         if(this.inputKeyDaily['price' + day.day] != null && this.inputKeyDaily['price' + day.day] > 0){
            havePrice = havePrice + 1;
         }
         if( this.inputKeyDaily['price' + day.day] != null && this.inputKeyDaily['price' + day.day] > 0){
          this.inputKeyDaily['price' + day.day] =+ this.inputKeyDaily['price' + day.day];
          sum = sum + this.inputKeyDaily['price' + day.day];
         }
       
          if(this.inputKeyDaily['price' + day.day] > 0 ){
            this.dailySaveRequest['price' + day.day] =  this.inputKeyDaily['price' + day.day];
          }else{
            this.dailySaveRequest['price' + day.day] = null;
          }
        }
      });
      console.log("sum",sum);
      console.log("havePrice",havePrice);
    this.calCurrentPrice = sum / havePrice;
    this.calCurrentPrice = +this.calCurrentPrice;
    let currency = this.currencyUnitList.find(x => x.paramId == this.inputKeyDaily.currencyUnit.paramInfoId);
    if(this.calCurrentPrice > 0){
      this.inputKeyDaily.currentPrice = this.calCurrentPrice;
    }else{
      this.inputKeyDaily.currentPrice = null;
    }
    console.log("this.calCurrentPrice;",this.calCurrentPrice);
    if(currency.paramInfo === "THB"){
      const prevPrice = this.inputKeyDaily.previousCalculatedPrice;
      this.inputKeyDaily.currentCalculatedPrice = this.inputKeyDaily.currentPrice;
      this.inputKeyDaily.currentCurrencyRate = 1;
      const currentCalculatedPrice = this.inputKeyDaily.currentCalculatedPrice;
      if(this.inputKeyDaily.previousCalculatedPrice != null && this.inputKeyDaily.currentCalculatedPrice  != null){
        const rel = (currentCalculatedPrice / prevPrice) * 100;
        const resultRel = rel.toFixed(5);
        this.inputKeyDaily.rel = resultRel;
      }else{
        this.inputKeyDaily.rel = null;
      }
    }else{
      let currencyRate = this.currencyList.find(x => x.currencyKey.currencyUnit.paramInfoId == this.inputKeyDaily.currencyUnit.paramInfoId);
      if(currencyRate){
        if(currency.exchangeRate != null){
          this.inputKeyDaily.currentCurrencyRate = currency.exchangeRate;
          this.inputKeyDaily.currentCalculatedPrice =  this.calCurrentPrice * currency.exchangeRate;
          const prevPrice = (this.inputKeyDaily.previousCalculatedPrice?this.inputKeyDaily.previousCalculatedPrice:null) * currency.exchangeRate;
          const currentPriceResult =  this.inputKeyDaily.currentCalculatedPrice? this.inputKeyDaily.currentCalculatedPrice:null;
          if(prevPrice != null && currentPriceResult != null){
            const rel = (currentPriceResult / prevPrice) * 100;
            const resultRel = rel.toFixed(5);
            this.inputKeyDaily.rel = resultRel;
          }else{
            this.inputKeyDaily.rel = null;
          }
      }else{
        this.inputKeyDaily.currentCalculatedPrice = null;
        this.inputKeyDaily.currentCurrencyRate = null;
        this.inputKeyDaily.rel = null;
      }
      }
    }
  }

  clickSave() {
    this.saveDailySwal.show();
  }
  onValidateDaily() {
    this.loading.show();
    let validatePrice = {currentPriceIsNull: [], cfLimit: [], percentChange: [], rel:[], notPrice:[], errorFlag: false};
    this.dailySaveRequest.remark =  this.inputKeyDaily.remark;
    this.dailySaveRequest.dataMatrixId =  this.inputKeyDaily.dataMatrixId;
    this.dailySaveRequest.monthTerm =  this.inputKeyDaily.monthTerm;
    this.dailySaveRequest.yearTerm =  this.inputKeyDaily.yearTerm;
    this.dailySaveRequest.baseYearId =  this.inputKeyDaily.baseYearId;
    this.dailySaveRequest.previousAdjustedPrice =  this.inputKeyDaily.previousAdjustedPrice;
    this.dailySaveRequest.previousPrice =  this.inputKeyDaily.previousPrice;
    if ( this.inputKeyDaily.imputationFlag == null) {
      this.dailySaveRequest.imputationFlag = null;
    } else if ( this.inputKeyDaily.imputationFlag == null ||  this.inputKeyDaily.imputationFlag > 0) {
      this.dailySaveRequest.imputationFlag =  this.inputKeyDaily.imputationFlag;
    } else if (typeof  this.inputKeyDaily.imputationFlag === 'object') {
      this.dailySaveRequest.imputationFlag =  this.inputKeyDaily.imputationFlag.paramInfoId;
    }
    this.dailySaveRequest.currentPrice = this.inputKeyDaily.currentPrice;
    this.dailySaveRequest.currentAdjustedPrice = this.dailySaveRequest.currentPrice;
    this.dailySaveRequest.currentCalculatedPrice = this.dailySaveRequest.currentAdjustedPrice;
    this.dailySaveRequest.previousCalculatedPrice = this.inputKeyDaily.previousCalculatedPrice;
    this.dailySaveRequest.link =  this.inputKeyDaily.link.paramInfoId;
    this.dailySaveRequest.relativeRatio =  this.inputKeyDaily.relativeRatio;
    this.dailySaveRequest.rel =  this.inputKeyDaily.rel;
    this.dailySaveRequest.requestCommentFlag =  this.inputKeyDaily.requestCommentFlag;
    this.dailySaveRequest.answerCommentFlag =  this.inputKeyDaily.answerCommentFlag;
    this.dailySaveRequest.commentNote =  this.inputKeyDaily.commentNote;
    this.dailySaveRequest.noOfCarrierForward = this.inputKeyDaily.noOfCarrierForward;
    this.dailySaveRequest.priceFlag = this.inputKeyDaily.priceFlag;
    let currency = this.currencyUnitList.find(x => x.paramId == this.inputKeyDaily.currencyUnit.paramInfoId);
    if (currency.paramInfo === "THB") {
      this.inputKeyDaily.currentCurrencyRate = 1;
    } else {
      let currencyRate = this.currencyList.find(x => x.currencyKey.currencyUnit.paramInfoId == this.inputKeyDaily.currencyUnit.paramInfoId);
      if (currencyRate) {
        if (currency.exchangeRate != null) {
          this.inputKeyDaily.currentCurrencyRate = currency.exchangeRate;
        } else {
          this.inputKeyDaily.currentCurrencyRate = null;
        }
      }
    }
    this.dailySaveRequest.currentCurrencyRate = this.inputKeyDaily.currentCurrencyRate;
    if ( this.dailySaveRequest.remark == "" ||  this.dailySaveRequest.remark == null) {
      /// case currentPrice
      if ( this.dailySaveRequest.currentPrice == null ||  this.dailySaveRequest.currentPrice == 0) {
        validatePrice.currentPriceIsNull.push(this.inputKeyDaily);
        validatePrice.errorFlag = true;
      }
      /// case noOfCarrierForward
      const cf = this.imputationList.find(x => x.paramId ==  this.dailySaveRequest.imputationFlag);
      if (cf) {
        if (cf.paramInfo == "CARRIER_FORWARD") {
          const noOfCarrierForward =  this.dailySaveRequest.noOfCarrierForward + 1;
          if (noOfCarrierForward >= this.inputKeyDaily.cpa.noOfCarrierForward && this.inputKeyDaily.cpa.noOfCarrierForward != null) {
            let obj = {'data':this.inputKeyDaily,'value':noOfCarrierForward,'valueDefault':this.inputKeyDaily.cpa.noOfCarrierForward};
            validatePrice.cfLimit.push(obj);
            validatePrice.errorFlag = true;
          }
        }
      }
      /// case percentChage
      if ( this.dailySaveRequest.currentAdjustedPrice > 0) {
        const percentChange = ( this.dailySaveRequest.currentAdjustedPrice -  this.dailySaveRequest.previousAdjustedPrice) /  this.dailySaveRequest.previousAdjustedPrice;
        const cal  = percentChange * 100;
        let result = + cal.toFixed(2);
        if(result < 0){
          result = result * -1;
        }
        if (result >= this.inputKeyDaily.cpa.pricePercentageChange && this.inputKeyDaily.cpa.pricePercentageChange != null) {
          let obj = {'data':this.inputKeyDaily,'value':result,'valueDefault':this.inputKeyDaily.cpa.pricePercentageChange};
          validatePrice.percentChange.push(obj);
          validatePrice.errorFlag = true;
        }
      }
      /// case rel <> 100
      if(this.dailySaveRequest.rel != null){
        if(this.dailySaveRequest.rel != 100){
          let obj = {'data': this.inputKeyDaily, 'value': this.dailySaveRequest.rel, 'valueDefault': 100};
          validatePrice.rel.push(obj);
          validatePrice.errorFlag = true;
        }
      }
      if(this.dailySaveRequest.priceFlag === 'Y'){
        validatePrice.notPrice.push(this.inputKeyDaily);
        validatePrice.errorFlag = true;
      }
    }
    if (validatePrice.errorFlag) {
      this.loading.hide();
      this.openCheckPrice(validatePrice);
    } else {
      this.loading.hide();
      this.onSaveDaily();
    }
  }

  onSaveDaily(){
    this.loading.show();
    console.log('dailySaveRequest', this.dailySaveRequest);
    this.keydailyService.saveDaily(this.dailySaveRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucesssaveDataSwal.show();
        this.setIsSaved();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
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
       this.onSaveDaily();
      }
    });
  }

  onChangeLink(event, data) {
    data.link.paramInfoId = event.value;
    console.log( " data.link.paramInfoId",data.link.paramInfoId);
    const findedObject = this.link.find(x => x.paramId === event.value);
    if (findedObject) {
      data.toggles.imputationFlag = this.setToggleImputation(findedObject.paramInfo);
      data.toggles.currentPriceFlag = this.setToggleCurrentPrice(findedObject.paramInfo);
      data.toggles.prevPriceFlag = this.setTogglePrevPrice(findedObject.paramInfo);
      data.previousAdjustedPrice = data.previousPrice;
      if(findedObject.paramInfo === '0'){
        this.calCurrentPriceOnSave();
        this.linkDisableInput =  false;
        data.previousAdjustedPrice = data.previousPrice;
      }else if(findedObject.paramInfo === '1' || findedObject.paramInfo === '2'){
        this.linkDisableInput =  true;
        data.previousAdjustedPrice = data.previousPrice;
        data.currentPrice =  data.previousAdjustedPrice;
      }else{
        this.linkDisableInput =  true;
      }

      // data.currentPrice = this.setCurrentPrice(findedObject.paramInfo, data);
      data.relativeRatio = this.setRelativeRatio(findedObject.paramInfo, data);
      const prevPrice =  data.previousAdjustedPrice;
      const currentPrice =  data.currentPrice;
      const rel = (currentPrice / prevPrice) * 100;
      const resultRel = rel.toFixed(5);
      this.inputKeyDaily.rel = resultRel;
      // this.inputKeyDaily.currentPrice = currentPrice;
    }
  }

  setCurrentPrice(paramCode, data) {
    let result = data.currentPrice;
    if (paramCode === '0') {
      this.calCurrentPriceOnSave();
      result = this.calCurrentPrice?this.calCurrentPrice:null;
    } else if (paramCode === '1') {
      result = data.previousAdjustedPrice;
    } else if (paramCode === '2') {
      result = data.previousAdjustedPrice;
    }
    else if (paramCode === '3') {
      result = data.previousAdjustedPrice;
    }
    return result;
  }

  setRelativeRatio(paramCode, data) {
    console.log(data);
    let result = 0;
    if (paramCode === '0') {
      result = Math.round((data.currentPrice / data.previousAdjustedPrice) * 100);
    } else if (paramCode === '1') {
      result = 100;
    } else if (paramCode === '2') {
      result = 100;
    } else if (paramCode === '3') {
      result = Math.round((data.currentPrice / data.previousAdjustedPrice) * 100);
    }
    return result;
  }

  setPrice(e) {
    this.calCurrentPriceOnSave();
    this.setIsEditing();
  }

  setRemark(e) {
    this.matrixOnKey[0].remark = e.target.value;
  }

  onCancelImputation() {
    this.calCurrentPriceOnSave();
    this.inputKeyDaily.currentPrice = null;
    this.inputKeyDaily.imputationFlag = null;
    this.inputKeyDaily.relativeRatio = null;
    this.inputKeyDaily.toggles.imputationFlag = false;
    this.linkDisableInput = false;
    console.log(this.inputKeyDaily);

  }

  setImputation(e) {
    if (e.imputationFlag == null) {
      return null;
    } else {
      if (e.imputationFlag > 0) {
        return e.imputationFlag;
      } else {
        return e.imputationFlag.paramInfoId;
      }
    }
  }

  private setToggleImputation(paramCode) {
    let result = false;
    if (paramCode === '0') {
      result = false;
    } else if (paramCode === '1') {
      this.linkDisableInput  = true;
      result = true;
    } else if (paramCode === '2') {
      this.linkDisableInput  = true;
      result = true;
    } else if (paramCode === '3') {
      this.linkDisableInput  = true;
      result = true;
    }
    return result;
  }

  private setToggleCurrentPrice(paramCode) {
    let result = true;
    if (paramCode === '0') {
      result = false;
    } else if (paramCode === '3') {
      result = false;
    }

    return true;
  }

  private setTogglePrevPrice(paramCode) {
    let result = true;
    if (paramCode === '3') {
      result = false;
    }

    return result;
  }

  changepreviousAdjustedPrice(e, data) {
    const sum: number = +(data.currentPrice / data.previousAdjustedPrice) * 100;
    data.rel = sum.toFixed(5);
  }

  openNeighborhoodDialog(data): void {
    const obj = {
      cpaParentId: data.cpa.parentId.cpaId,
      baseYearId: data.baseYearId,
      yearTerm: data.yearTerm,
      monthTerm: data.monthTerm,
      dataMatrixId: data.dataMatrixId,
    };
    console.log(obj);
    const dialogRef = this.dialog.open(NeighborhoodDialogComponent, {
      width: '700px',
      position: {
        top: '10%'
      },
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        data.currentPrice = result;
        data.currentAdjustedPrice = result;
        data.toggles.imputationFlag = true;
      } else {
        data.imputationFlag = null;
      }
    });
  }

  private openAveragePercentageDialog(data): void {
    console.log(data);
    const obj = {
      cpaParentId: data.cpa.cpaId,
      baseYearId: data.baseYear.baseYearId,
      yearTerm: data.yearTerm,
      monthTerm: data.monthTerm,
      dataMatrixId: data.dataMatrixId,
    };

    const dialogRef = this.dialog.open(AveragePercentageComponent, {
      width: '700px',
      position: {
        top: '10%'
      },
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog openAveragePercentageDialog was closed');
      console.log(result);
      if (result) {
          let priceAvg = (result * data.previousAdjustedPrice) / 100;
          data.relativeRatio = result;
          data.currentPrice = priceAvg;
          data.currentAdjustedPrice = priceAvg;
          data.toggles.imputationFlag = true;
      }else {
        data.imputationFlag = null;
      }
    });
  }

  openDialogComment(e): void {
    const dialogRef = this.dialog.open(DialogCommentComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: {data: e, typeUser: this.typeUser, page: 'keyin'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  setIsEditing() {
    this.sessionService.setIsSaved(false);
  }
  setIsSaved() {
    this.sessionService.setIsSaved(true);
  }

  expandPanel(matExpansionPanel, event: Event): void {
    console.log("matExpansionPanel",matExpansionPanel);
    event.stopPropagation();
    if(matExpansionPanel.expanded){
        if (!this._isExpansionIndicator(event.target)) {
          matExpansionPanel.close();
        }
    }else{
      if(!this._isExpansionIndicator(event.target)){
        matExpansionPanel.open();
      }
    }
  }

  private _isExpansionIndicator(target): boolean {
    const expansionIndicatorClass = 'mat-expansion-indicator';
    const spanDiv = 'expandPanel';
    if(target.classList){
      if(target.classList.contains(expansionIndicatorClass) || target.classList.contains(spanDiv)){
        return true;
      }else{
        return false;
      }
    }
    return false;
  }

  goToTop() {
    console.log('goToTop');
    window.scroll(0, 0);
  }

  setStep(index: number) {
    this.step = index;
  }

  getCurrency(){
   const todayDate = new Date();
   let thisMonth = todayDate.getMonth();
   let thisYear = todayDate.getFullYear();
   console.log("thisMonth",thisMonth);
   console.log("thisYear",thisYear);
   thisYear = thisYear + 543;
   thisMonth = thisMonth + 1;
    this.currencyService.getCurrencyByYearAndMonth(thisYear,thisMonth).subscribe(
      (res) => {
        this.currencyList = res;
        console.log("getCurrency",res);
      },(error) => {
        console.log(error);
      }
    )
  }

  priceFlag(e){
    if(e === "Y"){
      return true;
    }else{
      return false;
    }
  }

  onCheckPriceNot(event,element){
    console.log("onCheckPriceNot event",event);
    console.log("onCheckPriceNot element",element);
    if(event){
      element.fakeRemark = element.remark;
      if(element.remark != null){
        element.remark = element.remark + " ไม่สามารถหาราคาได้";
      }else{
        element.remark = "ไม่สามารถหาราคาได้";
      }
      element.priceFlag  = "Y";
    }else{
      element.priceFlag  = "N";
      const fix = "ไม่สามารถหาราคาได้";
      const remark:string = element.remark;
      const result = remark.trim();
      if(fix == result){
        element.remark = "";
      }
    }
  }

  inputCheckCalendar(){
    const dateCurrent = new Date();
    dateCurrent.setHours(0, 0, 0, 0);
    const calendar = this.sessionService.getCalendar();
      if (calendar.length > 0) {
          if(this.workFlowList.length > 0){
            let workFlow = calendar[0].month.find( x => x.durationCode == this.workFlowList[0].durationCode);
            let oldDate = new Date(workFlow.end);
            let newDate = new Date(this.workFlowList[0].extendedDate);
            if(newDate > oldDate){
              workFlow.end = ""+newDate;
            }
          }
          const month = calendar[0].month[0];
          const begin = new Date(month.begin);
          const end = new Date(month.end);
          if(dateCurrent >= begin && dateCurrent <= end){
            this.disablePrice1 = false;
          }else{
            this.disablePrice1 = true;
          }
      }
  }

  getWorkFlow(){
    let frequency = this.frequencyList.find( x => x.paramInfo == "MONTHLY");
    if(frequency){
      let model = new WorkFlowEntyRequest();
      model.frequency = frequency.paramId;
      this.dataentyService.getWorkFlow(model).subscribe(
        (res) => {
          this.workFlowList = res;
          this.inputCheckCalendar();
        },(error) => {
          console.log(error);
        }
      )
    }
  }



}





