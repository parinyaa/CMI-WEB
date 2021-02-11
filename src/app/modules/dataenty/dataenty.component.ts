import {PriceDataRequestForm} from './../../shared/models/dataenty/request/PriceDataRequestForm';
import * as FileSaver from 'file-saver';
import {CalendarService} from 'src/app/core/service/calendar/calendar.service';
import {element} from 'protractor';
import {async} from '@angular/core/testing';
import {ParamService} from 'src/app/core/service/param/param.service';
import {GetDataSetRequest} from '../../shared/models/dataenty/request/GetDataSetRequest';
import {
  MatTableDataSource,
  MatTab,
  MatTabGroup,
  MatDialog,
} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';
import {GetMatrixRequest} from '../../shared/models/dataenty/request/GetMatrixRequest';
import {DataEntyService} from '../../core/service/dataenty/dataenty.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ContentChild,
  OnDestroy,
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {SessionServiceService} from '../../core/service/common/session-service.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {KeyinPageComponent} from '../keyin-data/page/keyin-page.component';
import {ParamGroup} from 'src/app/shared/common/GetParam';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {KeyinDailyComponent} from '../keyin-daily/keyin-daily.component';
import {DialogCreateInboxComponent} from '../workflow/component/dialog-create-inbox/dialog-create-inbox.component';
import {GetCalendar} from 'src/app/shared/models/calendar/GetCalendar';
import {PeriodCurrent} from '../commodity-validate/models/relative-request';

@Component({
  selector: 'app-dataenty',
  templateUrl: './dataenty.component.html',
  styleUrls: ['./dataenty.component.scss'],
})
export class DataentyComponent implements OnInit, OnDestroy {
  @ViewChild('tabFrequency', {static: false}) tabFrequency: MatTabGroup;
  @ViewChild('myElem', {static: false}) myElem: ElementRef;
  @ViewChild('saveDataSwal', {static: false}) saveDataSwal: SwalComponent;
  @ViewChild(KeyinPageComponent, {static: false})
  keyinComponent: KeyinPageComponent;
  @ViewChild(KeyinDailyComponent, {static: false})
  keyinDailyComponent: KeyinDailyComponent;
  @ViewChild('dataEntyNoData', {static: false}) dataEntyNoData: SwalComponent;
  displayedMonthly: string[] = ['commodityCode', 'commodityName', 'totalkey'];
  weekly = [];
  frequencyList = new Array();
  frequencyIndox = '';
  dataMatrix = new MatTableDataSource();
  showTab = false;
  frequency = 'MONTHLY';
  alertSaveMessage: string;
  tabIndex = 0;
  showRoute = false;
  monthlyTab = false;
  weeklyTab = false;
  FortnightlyTab = false;
  dailyTab = false;
  divNoDataEntry = false;
  inboxFilterCommodityName = '';
  inboxFilterSurveyName = '';
  inboxFilterCommodityCode = '';
  inboxTab = 0;
  inboxSelectFrequency = new Array();
  isCreate = false;
  isCreateWorkflow = false;
  currentParamFrequency;
  durationMonthList = new Array();
  durationWeekList = new Array();
  durationFortnightList = new Array();
  WorkflowList;
  workflowType;
  arrayIndexRemoveDuration = new Array();
  userType = null;
  currentPeriod = new PeriodCurrent();
  constructor(
    private dataEntyService: DataEntyService,
    private loading: NgxSpinnerService,
    private sessionService: SessionServiceService,
    private paramService: ParamService,
    private calendarService: CalendarService,
    private dialog: MatDialog,
  ) {
    this.isCreate = this.sessionService.checkProfileIsContainObject(
      'CREATE_EXTENDED_PERIOD',
    );
  }

  ngOnInit() {
    this.getCurrentPeriod();
    const userProfile = this.sessionService.getUserProfile();
    if (
      userProfile.userTypeCode === 'CENTRAL_USER' ||
      userProfile.userTypeCode === 'PERMANANT_CENTRAL' ||
      userProfile.userTypeCode === 'INSPECTOR_CENTRAL' ||
      userProfile.userTypeCode === 'INSPECTOR_CHIEF' ||
      userProfile.userTypeCode === 'ENTREPRENEUR_USER' ||
      userProfile.userTypeCode === 'PROVINCE_USER'
    ) {
      this.preparePage();
      sessionStorage.removeItem('frequency');
      sessionStorage.removeItem('currentTabIndex');
      this.frequency = this.sessionService.getFrequency()
        ? this.sessionService.getFrequency()
        : this.frequency;
      this.tabIndex = this.sessionService.getTabIndex()
        ? this.sessionService.getTabIndex()
        : this.tabIndex;
      this.userType = userProfile.userTypeCode;
      this.showRoute = this.getShowRoute();
      console.log(this.sessionService.getUserProfile());
    } else {
      this.divNoDataEntry = true;
    }
  }
  ngOnDestroy(): void {
    console.log('on destroy activate');
  }

  searchInboxPriceData() {
    const stateValue = history.state;
    if (
      stateValue.frequency != undefined &&
      stateValue.commodityName != undefined &&
      stateValue.surveyName != undefined
    ) {
      const frequency = this.frequencyList.find(
        (x) => x.paramId === stateValue.frequency,
      );
      this.frequencyIndox = frequency.paramInfo;
      this.inboxFilterCommodityName = stateValue.commodityName;
      this.inboxFilterCommodityCode = stateValue.commodityCode;
      this.inboxFilterSurveyName = stateValue.surveyName;
    } else {
      this.frequencyIndox = '';
      this.inboxFilterCommodityName = '';
      this.inboxFilterSurveyName = '';
      this.inboxFilterCommodityCode = '';
    }
  }

  async preparePage(): Promise<any> {
    this.loading.show();
    this.paramService.getParamsGroupAll().subscribe((res) => {
      const rx = this.getParams();
      rx.then(
        (x) => {
          if (x) {
            this.getDataSet();
            this.searchInboxPriceData();
          }
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
    });
  }

  getParams() {
    this.WorkflowList = this.paramService.getParamByGroup(
      ParamGroup.workflowType,
    );
    this.WorkflowList.forEach((element) => {
      if (element.paramInfo == 'EXTENDED_PERIOD') {
        this.workflowType = element;
      }
    });
    this.frequencyList = this.paramService
      .getParamByGroup(ParamGroup.frequenct)
      .sort((a, b) => a.orderNo - b.orderNo);
    console.log(this.frequencyList);
    if (this.frequencyList) {
      this.alertSaveMessage = this.paramService.getParamByGroupCodeAndInfoCode(
        'ERROR_MESSAGE',
        'PED01',
      ).paramLocalMessage;
      console.log(this.alertSaveMessage);
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  }

  getDataSet() {
    const userProfile = this.sessionService.getUserProfile();
    this.dataMatrix = new MatTableDataSource([]);
    const dataSetRequests: Array<GetDataSetRequest> = new Array<
      GetDataSetRequest
    >();
    this.frequencyList.forEach((x) => {
      const frequency = x.paramInfo;
      const data: GetDataSetRequest = new GetDataSetRequest();
      data.userType = userProfile.userType;
      data.provinceId =
        userProfile.provinceId === null ? 1 : userProfile.provinceId;
      data.surveyId = userProfile.surveyId;
      data.frequency = frequency;
      dataSetRequests.push(data);
    });
    if (dataSetRequests.length > 0) {
      const data0 = dataSetRequests.pop();
      if (data0) {
        this.dataEntyService.getDataSet(data0).subscribe(
          (res0) => {
            if (res0.monthly === 0 && res0.weekly === 0) {
              this.loading.hide();
              this.divNoDataEntry = true;
            } else if (res0) {
              if (res0.monthly > 0) {
                const monthly = this.frequencyList.find(
                  (x) => x.paramInfo === 'MONTHLY',
                );
                monthly.use = true;
                this.inboxSelectFrequency.push(monthly);
              }
              if (res0.weekly > 0) {
                const weekly = this.frequencyList.find(
                  (x) => x.paramInfo === 'WEEKLY',
                );
                weekly.use = true;
                this.inboxSelectFrequency.push(weekly);
              }
            }
            console.log('inboxSelectFrequency', this.inboxSelectFrequency);
            let select = 0;
            if (history.state.frequency) {
              select = this.inboxSelectFrequency
                .map(function (e) {
                  return e.paramId;
                })
                .indexOf(history.state.frequency);
            }
            this.inboxTab = select;
            this.tabIndex = select;
          },
          (error) => {
            this.loading.hide();
          },
        );
      }
    }
  }

  getUseFrequency(data: GetDataSetRequest, response: any): boolean {
    let result = false;
    if (data.frequency === 'MONTHLY' && response.length > 0) {
      result = true;
      console.log('MONTHLY', response);
    } else if (data.frequency === 'WEEKLY' && response.length > 0) {
      result = true;
      console.log('WEEKLY', response);
    }
    return result;
  }

  getDataFirstTab(): any {
    this.loading.hide();
    if (this.tabFrequency) {
      this.tabFrequency.selectedIndex = 0;
      this.sessionService.setTabIndex(0);
      const tabFirst = this.tabFrequency._tabs.first.textLabel;
      const frequency = this.frequencyList.find(
        (x) => x.paramLocalMessage == tabFirst,
      );
      if (frequency) {
        this.tabFrequency._tabs.first.isActive = true;
        this.openRow(null, frequency.paramInfo);
      }
    }
  }

  setShowRoute(showRoute: boolean) {
    this.dataEntyService.setShowRoute(showRoute);
  }

  getShowRoute() {
    return this.dataEntyService.getShowRoute();
  }

  openRow(row, frequencyType) {
    const rx = this.doCheckSavedProcess();
    rx.then(
      (x) => {
        if (x) {
          console.log('click ' + frequencyType);

          if (this.frequencyIndox != '' && this.inboxTab == this.tabIndex) {
            frequencyType = this.frequencyIndox;
          }
          if (this.inboxTab != this.tabIndex) {
            this.inboxFilterCommodityName = '';
            this.inboxFilterSurveyName = '';
            this.inboxFilterCommodityCode = '';
          }
          this.sessionService.setFrequency(frequencyType);
          this.frequency = this.sessionService.getFrequency();
          this.setShowRoute(true);
          this.showRoute = this.getShowRoute();
          const keyinParam = {
            frequency: frequencyType,
          };
          this.sessionService.setKeyinParam(keyinParam);
          this.keyinComponent.FilterInboxCommodityName = this.inboxFilterCommodityName;
          this.keyinComponent.FilterInboxSurvey = this.inboxFilterSurveyName;
          this.keyinComponent.FilterInboxCommodityCode = this.inboxFilterCommodityCode;
          this.keyinComponent.preparePage();
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  doCheckSavedProcess() {
    let result = false;
    const isSaved = this.sessionService.getIsSaved();
    if (isSaved) {
      result = true;
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    } else {
      if (!this.showRoute) {
        result = true;
        this.sessionService.setIsSaved(true);
        return new Promise((resolve, reject) => {
          resolve(result);
        });
      } else {
        return this.saveDataSwal.show().then((x) => {
          console.log('saveDataSwal',x);
          if (x.dismiss === 'cancel') {
            result = false;
          } 
          if (x.value === true) {
            result = true;
          }
          this.setIsSaved();
          return result;
        });
      }
    }
  }

  selectedTabChange(e) {
    console.log('selectedTabChange ===== > ', e);
    let request = new GetCalendar();
    request.month = this.currentPeriod.month - 1;
    request.year = this.currentPeriod.year;
    request.yearId = this.currentPeriod.yearId;;
    this.getCalendar(request);
    const rx = this.doCheckSavedProcess();
    console.log(e);
    rx.then(
      (x) => {
        console.log(x);
        if (x) {
          this.sessionService.setTabIndex(e.index);
          this.tabIndex = this.sessionService.getTabIndex();
          this.setShowRoute(false);
          this.showRoute = this.getShowRoute();
          const params = this.frequencyList.find(
            (x) => x.paramLocalMessage == e.tab.textLabel,
          );
          this.frequency = params.paramInfo;
          this.openRow(null, this.frequency);
        } else {
          this.tabIndex = this.sessionService.getTabIndex();
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  setIsSaved() {
    this.sessionService.setIsSaved(true);
  }

  getCalendar(request: GetCalendar) {
    this.calendarService.getCalendar(request).subscribe(
      (res) => {
        console.log('getCalendar ===   ',res);
        
        this.sessionService.setCalendar(res);
        this.durationMonthList = res[0].month.sort((a, b) =>
          a.durationCode > b.durationCode ? 1 : -1,
        );
        this.durationWeekList = res[0].week.sort((a, b) =>
          a.durationCode > b.durationCode ? 1 : -1,
        );
        this.keyinComponent.getWorkFlow();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  openCreateFlowDialog() {
    let data = {
      frequency: this.currentParamFrequency,
      workflowType: this.workflowType,
      durationList: new Array(),
    };
    if (this.currentParamFrequency.paramInfo == 'MONTHLY') {
      this.arrayIndexRemoveDuration.forEach((element) => {
        data.durationList.push(this.durationMonthList[element]);
      });
    } else if (this.currentParamFrequency.paramInfo == 'WEEKLY') {
      this.arrayIndexRemoveDuration.forEach((element) => {
        data.durationList.push(this.durationWeekList[element]);
      });
    }

    const dialogRef = this.dialog.open(DialogCreateInboxComponent, {
      width: '850px',
      position: {
        top: '3%',
      },
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  changeTabEvent(event) {
    this.isCreateWorkflow = false;
    this.frequencyList.forEach((element) => {
      let tmp: any = element;
      if (tmp.paramInfo == this.sessionService.getKeyinParam().frequency) {
        this.currentParamFrequency = tmp;
      }
    });
    console.log('emit list', event);
    if (event.length > 0) {
      this.isCreateWorkflow = true;
      this.arrayIndexRemoveDuration = event;
    }
  }

  onExport() {
    let params: PriceDataRequestForm = this.sessionService.getPriceDataByFrequency();
    if (params) {
      this.loading.show();
      let request = new PriceDataRequestForm();
      let frequencyName = this.frequencyList.find(
        (x) => x.paramInfo == params.frequency,
      );
      request.frequency = params.frequency;
      request.monthTerm = params.monthTerm;
      request.yearTerm = params.yearTerm;
      this.dataEntyService.exportReport(request).subscribe(
        (res) => {
          this.loading.hide();
          console.log(res);
          const file = new Blob([res], {type: 'application/pdf'});
          const url = window.URL.createObjectURL(file);
          window.open(url);
          FileSaver.saveAs(
            res,
            'รายงานการบันทึกราคา' +
              frequencyName.paramLocalMessage +
              new Date().toISOString() +
              '.pdf',
          );
        },
        (error) => {
          this.loading.hide();
          console.log(new Blob([error.error.text]));
        },
      );
    }
  }

  onSearch(e: GetCalendar) {
    console.log('onSearch', e);
    this.getCalendar(e);
  }

  getCurrentPeriod() {
    this.calendarService.inquireCurrentPeriod().subscribe(
      (res) => {
        this.currentPeriod = res;
        let request = new GetCalendar();
        request.month = this.currentPeriod.month - 1;
        request.year = this.currentPeriod.year;
        request.yearId = this.currentPeriod.yearId;
        this.getCalendar(request);
      },
      (error) => {},
    );
  }
}
