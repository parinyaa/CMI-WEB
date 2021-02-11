import { FilterDataComponent } from './../filter-data/filter-data.component';
import { ConditionFilter, ConditionGetCapWeight, ConditionGetCapIndex, ConditionGetAvgBaseIndex, ConditionGetRebaseIndex } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { CpaIndex, CpaWeight, RebaseIndex, AvgBaseIndex } from './../../models/response-data';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatSort, MatTableDataSource, PageEvent, Sort, MatTabChangeEvent, MatPaginator, MatStepper } from '@angular/material';
import { RebaseServiceService } from '../../../../core/service/rebase/rebase-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestParam, AvgBaseWeightReq, ProvinceRes } from '../../models/request-param';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-stage-sixth',
  templateUrl: './view-stage-sixth.component.html',
  styleUrls: ['./view-stage-sixth.component.scss']
})
export class ViewStageSixthComponent implements OnInit {
  @Input() provinceId: ProvinceRes;
  @Input() indexGroup: any;
  @Input() regionId: any;
  @Input() stepper: MatStepper;
  @Output() step = new EventEmitter<any>();
  @Input() stage40: number;
  @ViewChild("paginator1", { static: true }) paginator1: MatPaginator;
  @ViewChild("paginator2", { static: true }) paginator2: MatPaginator;
  @ViewChild("avgIndex", { static: false }) avgIndexFilter: FilterDataComponent;
  @ViewChild("rebaseIndex", { static: false }) rebaseIndexFilter: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5', '6'
    , '7', '8', '9', '10', '11'];
  columns: string[] = ['e.year_term', 'e.month_term', ' e.commodity_code',
    ' e.commodity_level', 'e.index_value', 'e.change_mom ', 'e.change_aoa', 'e.change_yoy',
    'e.base_index_value', ' e.change_base_mom', ' e.change_base_aoa', 'e.change_base_yoy'];
  displayedColumnsWeight: string[] = ['0', '1', '2', '3', '4', '5'];
  columnsAvgI: string[] = ['b.baseYear', 'cpip.commodityCode', 'cpip.commodityThName', 'commodityLevel', 'averageIndex'];
  length = 100;
  pageSize = 10;
  tabActive = 0;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<RebaseIndex>();
  dataSourceWeight = new MatTableDataSource<AvgBaseIndex>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  sortMap2: Map<string, MatSort> = new Map<string, MatSort>();
  conditionAvgIndex = new ConditionFilter();
  requestFilterAvgIndex = new ConditionGetAvgBaseIndex();
  conditionRebaseIndex = new ConditionFilter();
  requestFilterRebaseIndex = new ConditionGetRebaseIndex();
  colNamesAvgI: string[] = ['cpip.commodityCode'];
  colOrdersAvgI: string[] = ['asc'];
  colNamesRebaseIndex: string[] = ['cpip.commodityCode'];
  colOrdersRebaseIndex: string[] = ['asc'];
  avgBaseWeightReq = new AvgBaseWeightReq();
  province: ProvinceRes;
  @Input() filterProvinceControl: FormControl;
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit() {
  }

  public preparePage(): void {
    this.avgBaseWeightReq.indexGroup = this.indexGroup === null ? null : this.indexGroup.paramId;
    if (this.filterProvinceControl.value) {
      this.province = this.filterProvinceControl.value
      this.avgBaseWeightReq.provinceId = this.province === null ? null : this.province.provinceId;;

    } else {
      this.avgBaseWeightReq.regionId = this.regionId === null ? null : this.regionId.regionId;;
    }
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.setConditionFilterWeight();
    this.getPublicCpiWeight(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
  }

  setConditionFilterWeight() {
    this.conditionAvgIndex.commodityCode = true;
    this.conditionAvgIndex.commodityName = true;
    this.conditionAvgIndex.btnSearch = true;
    this.avgIndexFilter.conditionInput(this.conditionAvgIndex);
  }

  setConditionFilterIndex() {
    this.conditionRebaseIndex.commodityCode = true;
    this.conditionRebaseIndex.commodityName = true;
    this.conditionRebaseIndex.btnSearch = true;
    this.rebaseIndexFilter.conditionInput(this.conditionRebaseIndex);
  }



  public getPublicCpiWeight(pageEvent: PageEvent, requestFilterAvgIndex: ConditionGetAvgBaseIndex, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMap.forEach(k => {
      const colName = this.columnsAvgI[this.displayedColumnsWeight.indexOf(k.active)];
      this.colNamesAvgI.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrdersAvgI.push(direction);
    });
    requestParam.sortColumns = this.colNamesAvgI;
    requestParam.sortOrders = this.colOrdersAvgI;
    requestParam.condition = requestFilterAvgIndex;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getPublicCpiWeight(requestParam).subscribe(
      (resp) => {
        this.dataSourceWeight = new MatTableDataSource<AvgBaseIndex>(resp.data);
        this.length = resp.dataSize;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  public getPublicCpiIndex(pageEvent: PageEvent, requestFilterRebaseIndex: ConditionGetRebaseIndex, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMap2.forEach(k => {
      const colName = this.columns[this.displayedColumns.indexOf(k.active)];
      this.colNamesRebaseIndex.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrdersRebaseIndex.push(direction);
    });
    requestParam.sortColumns = this.colNamesRebaseIndex;
    requestParam.sortOrders = this.colOrdersRebaseIndex;
    requestParam.condition = requestFilterRebaseIndex;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getPublicCpiIndex(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<RebaseIndex>(resp.data);
        this.length = resp.dataSize;
        this.pageEvent.length = resp.dataSize;
        this.pageIndex = pageEvent.pageIndex;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  selectedTabChange(e: MatTabChangeEvent) {
    this.tabActive = e.index;
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    console.log(e);
    if (e.index == 0) {
      this.paginator1.firstPage();
      this.requestFilterAvgIndex = new ConditionGetAvgBaseIndex();
      this.getPublicCpiWeight(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    } else if (e.index == 1) {
      this.paginator2.firstPage();
      this.requestFilterRebaseIndex = new ConditionGetRebaseIndex();
      this.setConditionFilterIndex();
      this.getPublicCpiIndex(this.pageEvent, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
  }

  pageChange(e: PageEvent): PageEvent {
    this.pageEvent = e;
    if (this.tabActive == 0) {
      this.getPublicCpiWeight(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    } else if (this.tabActive == 1) {
      this.getPublicCpiIndex(e, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
    return e;
  }

  sortChangeAvgI(e: Sort) {
    this.sort.active = e.active;
    this.sort.direction = e.direction;
    const direction: string = this.sort.direction;
    if (!direction) {
      this.sort.direction = 'asc';
    }
    const mySort: MatSort = new MatSort();
    mySort.active = this.sort.active;
    mySort.direction = this.sort.direction;
    if (this.tabActive == 0) {
      this.colNamesAvgI = [];
      this.colOrdersAvgI = [];
      this.sortMap.set(e.active, mySort);
      this.getPublicCpiWeight(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    } else if (this.tabActive == 1) {
      this.colNamesRebaseIndex = [];
      this.colOrdersRebaseIndex = [];
      this.sortMap2.set(e.active, mySort);
      this.getPublicCpiIndex(this.pageEvent, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
  }

  onSearchAvgBaseIndex(status) {
    console.log(status);
    if (status) {
      let filter = this.avgIndexFilter.getConditionFilter();
      this.requestFilterAvgIndex.commodityCode = filter.commodityCode;
      this.requestFilterAvgIndex.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.paginator1.firstPage();
      this.getPublicCpiWeight(this.pageEvent, this.requestFilterAvgIndex, this.avgBaseWeightReq);
    }
  }

  onSearchRebaseIndex(status) {
    if (status) {
      let filter = this.rebaseIndexFilter.getConditionFilter();
      this.requestFilterRebaseIndex.yearTerm = filter.yearTerm;
      this.requestFilterRebaseIndex.monthTerm = filter.monthTerm;
      this.requestFilterRebaseIndex.commodityCode = filter.commodityCode;
      this.requestFilterRebaseIndex.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getPublicCpiIndex(this.pageEvent, this.requestFilterRebaseIndex, this.avgBaseWeightReq);
    }
  }

  exportIndex(): void {
    this.loading.show();
    this.rebaseService.exportPublicCpiIndex(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'public_index' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportPublicCpiWeight(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'public_weight' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  goNext() {
    this.step.emit(this.stepper)
  }

}
