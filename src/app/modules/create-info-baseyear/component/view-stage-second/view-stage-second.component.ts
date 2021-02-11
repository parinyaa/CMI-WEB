import { ConditionGetAvgBaseWeight, ConfitionGetBasePrice } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatStepper, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { AvgBaseWeight, BasePrice } from '../../models/response-data';
import { RebaseServiceService } from '../../../../core/service/rebase/rebase-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AvgBaseWeightReq, ProvinceRes, RequestParam } from '../../models/request-param';
import * as FileSaver from 'file-saver';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-stage-second',
  templateUrl: './view-stage-second.component.html',
  styleUrls: ['./view-stage-second.component.scss']
})
export class ViewStageSecondComponent implements OnInit {
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  // displayedColumns: string[] = ['0', '1', '2', '3', '4'];
  displayedColumns: string[] = ['commodityCode', 'commodityName', 'yearTerm',
  'price01','price02','price03','price04','price05','price06',
  'price07','price08','price09','price10','price11','price12','priceAvg'];
  columns: string[] = ['vcrbp.COMMODITYCODE', 'vcrbp.COMMODITYNAME','vcrbp.YEARTERM','vcrbp.PRICE_AVG'];
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<BasePrice>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  condition = new ConditionFilter();
  requestFilter = new ConfitionGetBasePrice();
  //เก่า
  // colNames: string[] = ['e.year_term', 'e.MONTH_TERM', 'cpa.commodity_code'];
  colNames: string[] = ['vcrbp.COMMODITYCODE', 'vcrbp.COMMODITYNAME','vcrbp.YEARTERM'];
  colOrders: string[] = ['asc', 'asc', 'asc'];
  @Input() provinceId: any;
  @Input() indexGroup: any;
  @Input() regionId: any;
  @Input() stepper: MatStepper;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @Input() filterProvinceControl: FormControl;
  @Input() stage40: number;
  province: ProvinceRes;
  avgBaseWeightReq = new AvgBaseWeightReq();
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.yearTerm = true;
    // this.condition.monthTerm = true;
    this.condition.btnSearch = true;
  }

  ngOnInit() {
  }

  public preparePage(): void {
    console.log('stage40 === ', this.stage40);
    console.log('this.stepper  === ', this.stepper);
    console.log('filterProvinceControl === ', this.filterProvinceControl);


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
    this.getBasePrice(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    this.filterDataComponent.conditionInput(this.condition);
    console.log('provinceIdTab2 ==== ', this.provinceId);
    console.log('indexGroupTab2 ==== ', this.indexGroup);
    console.log('regionIdTab2 ==== ', this.regionId);
  }
  goNext() {
    this.step.emit(this.stepper)
  }



  public getBasePrice(pageEvent: PageEvent, requestFilter: ConfitionGetBasePrice, avgBaseWeightReq: AvgBaseWeightReq): void {
    const requestParam: RequestParam = new RequestParam();
    requestParam.page = pageEvent.pageIndex;
    requestParam.size = pageEvent.pageSize;
    this.sortMap.forEach(k => {
      const colName = this.columns[this.displayedColumns.indexOf(k.active)];
      this.colNames.push(colName);
      let direction: string = k.direction;
      if (!direction) {
        direction = 'asc';
      }
      this.colOrders.push(direction);
    });
    requestParam.sortColumns = this.colNames;
    requestParam.sortOrders = this.colOrders;
    requestParam.condition = requestFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;

    console.log('reqGetBasePrice ==== ', requestParam);

    this.loading.show();
    this.rebaseService.getBasePrice(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<BasePrice>(resp.data);
        this.length = resp.dataSize;
        this.pageIndex = pageEvent.pageIndex;
        this.pageEvent.length = resp.dataSize;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  sortChange(e: Sort) {
    console.log(e);
    this.colNames = [];
    this.colOrders = [];
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

    this.getBasePrice(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getBasePrice(e, this.requestFilter, this.avgBaseWeightReq);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportBasePrice(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'base_price_' + new Date().toISOString() + '.csv');
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
      console.log("getConditionFilter");
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName = filter.commodityName;
      this.requestFilter.yearTerm = filter.yearTerm;
      this.requestFilter.monthTerm = filter.monthTerm;
      this.pageEvent.pageIndex = 0;
      this.getBasePrice(this.pageEvent, this.requestFilter, this.avgBaseWeightReq);
    }
  }

  changeStage() {
    this.stage.emit(5.2);
  }

}
