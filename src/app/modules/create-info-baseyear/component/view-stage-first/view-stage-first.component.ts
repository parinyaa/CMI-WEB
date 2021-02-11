import { ConditionGetAvgBaseWeight } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import localeTh from '@angular/common/locales/th';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RebaseServiceService } from '../../../../core/service/rebase/rebase-service.service';
import { MatSort, MatStepper, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AvgBaseWeightReq, ProvinceRes, RequestParam } from '../../models/request-param';
import { AvgBaseWeight } from '../../models/response-data';
import * as FileSaver from 'file-saver';
import { registerLocaleData } from '@angular/common';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-stage-first',
  templateUrl: './view-stage-first.component.html',
  styleUrls: ['./view-stage-first.component.scss']
})
export class ViewStageFirstComponent implements OnInit {
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3', '4', '5'];
  columns: string[] = ['baseYear', 'cpip.commodityCode', 'cpip.commodityThName',
    'cpip.commodityLevel', 'averageWeight', 'averagePrice'];
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<AvgBaseWeight>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  haveData = null;
  condition = new ConditionFilter();
  requestFilter = new ConditionGetAvgBaseWeight();
  provinceIdCurrent: number;
  indexGroupCurrent: number;
  regionIdCurrent: number;
  avgBaseWeightReq = new AvgBaseWeightReq();
  @Input() stepper: MatStepper;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @Output() stepStart = new EventEmitter<any>();
  @Input() stage40: number;
  @Input() tabCurrent: number;
  province: ProvinceRes;
  @Input() set filterProvinceControl(filterProvinceControl: FormControl) {

    if (filterProvinceControl) {
      this.province = filterProvinceControl.value;
      this.avgBaseWeightReq.provinceId = this.province === null ? null : this.province.provinceId;

    }

  }
  @Input() set indexGroup(indexGroup: any) {
    console.log(indexGroup);

    if (indexGroup) {

      this.indexGroupCurrent = indexGroup.paramId;
      this.avgBaseWeightReq.indexGroup = this.indexGroupCurrent;
      this.avgBaseWeightReq.indexGroup = indexGroup === null ? null : this.indexGroupCurrent;
    }
  }
  @Input() set regionId(regionId: any) {
    if (regionId) {
      this.regionIdCurrent = regionId.regionId;
      this.avgBaseWeightReq.regionId = regionId === null ? null : this.regionIdCurrent;
    }
  }
  @Input() set searchActive(searchActive: boolean) {
    if (searchActive === true) {
      console.log('******searchActive******', this.stage40);

      this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);

    }
  }
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    registerLocaleData(localeTh, 'th');
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
  }

  ngOnInit() {
    console.log("tabCurrent-first" + this.tabCurrent);
    this.sort = new MatSort();
    this.sort.active = '2';
    this.sort.direction = 'asc';
    // this.getAvgBaseWeight(this.pageEvent , this.requestFilter, this.avgBaseWeightReq);

  }

  goNext() {
    this.step.emit(this.stepper)
  }
  getStep40() {
    this.stepStart.emit();
  }

  ngAfterViewInit() {
    this.filterDataComponent.conditionInput(this.condition);
  }

  prepage() {
    console.log('indexGroupTab1 === ', this.indexGroupCurrent);
    console.log('provinceTes2 ==== ', this.provinceIdCurrent);
    console.log('regionIdTab1 === ', this.regionIdCurrent);



    this.sort = new MatSort();
    this.sort.active = '2';
    this.sort.direction = 'asc';
    this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    this.filterDataComponent.conditionInput(this.condition);
  }

  public getAvgBaseWeight(pageEvent: PageEvent, requestFilter: ConditionGetAvgBaseWeight, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    const colNames: string[] = [];
    const colOrders: string[] = [];
    this.sortMap.forEach(k => {
      const colName = this.columns[this.displayedColumns.indexOf(k.active)];
      colNames.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      colOrders.push(direction);
    });
    requestParam.sortColumns = colNames;
    requestParam.sortOrders = colOrders;
    requestParam.condition = requestFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    console.log('requestParam======== ', requestParam);

    this.loading.show();
    this.rebaseService.getAvgBaseWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<AvgBaseWeight>(resp.data);
        this.haveData = resp.dataSize;
        this.length = resp.dataSize;
        this.pageIndex = pageEvent.pageIndex;
        this.pageEvent.length = resp.dataSize;
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  sortChange(e: Sort) {
    console.log(e);
    this.sort.active = e.active;
    this.sort.direction = e.direction;

    const direction: string = this.sort.direction;
    if (!direction) {
      this.sort.direction = 'asc';
    }
    const mySort: MatSort = new MatSort();
    mySort.active = this.sort.active;
    mySort.direction = this.sort.direction;
    this.sortMap.set(e.active, mySort);

    this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getAvgBaseWeight(e, this.requestFilter, this.avgBaseWeightReq);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportAvgBaseWeight(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: 'text/csv;charset=utf-8' });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'avg_base_weight_' + new Date().toISOString() + '.xlsx');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  onSearch(status) {
    if (status) {
      let filter = this.filterDataComponent.getConditionFilter();
      this.requestFilter.baseYear = filter.baseYear;
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName = filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getAvgBaseWeight(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    }
  }

  changeStage() {
    this.stage.emit(5.1);
  }



}




