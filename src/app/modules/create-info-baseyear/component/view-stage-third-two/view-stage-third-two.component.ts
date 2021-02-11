import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { BaseWeight } from '../../models/response-data';
import { MatTableDataSource, PageEvent, MatSort, MatStepper, Sort } from '@angular/material';
import { FilterDataComponent } from '../filter-data/filter-data.component';
import { ConditionFilter, ConditionGetAvgBaseWeight, ConditonGetBaseWeight } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { ProvinceRes, AvgBaseWeightReq, RequestParam } from '../../models/request-param';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { RebaseServiceService } from 'src/app/core/service/rebase/rebase-service.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-view-stage-third-two',
  templateUrl: './view-stage-third-two.component.html',
  styleUrls: ['./view-stage-third-two.component.scss']
})
export class ViewStageThirdTwoComponent implements OnInit {
  @ViewChild("wbar", { static: false }) wbarFilter: FilterDataComponent;
  displayedColumns: string[] = ['commodityLevel', 'commodityCode', 'commodityName', 'yearTerm',
                                'weight01','weight02','weight03','weight04','weight05','weight06','weight07',
                                'weight08','weight09','weight10','weight11','weight12','weightTotal','weightAvg'];
  //เก่า
  // columns: string[] = ['e.year_term', 'e.month_term', 'cpip.commodity_code', 'cpip.commodity_th_name',
  //   'cpip.commodity_level', 'e.weight'];
    columns: string[] = ['vcrbw.YEARTERM', 'vcrbw.COMMODITYCODE', 'vcrbw.COMMODITYNAME',
    'vcrbw.COMMODITYLEVEL', 'vcrbw.WEIGHT_TOTAL'];

  tabActive = 0;
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<BaseWeight>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  condition = new ConditionFilter();
  conditionWbar = new ConditionFilter();
  requestFilter = new ConditionGetAvgBaseWeight();
  requestWbarFilter = new ConditonGetBaseWeight();
  //เก่า
  // colNames: string[] = ['e.year_term', 'e.month_term', 'cpip.commodity_code'];
  colNames: string[] = ['vcrbw.COMMODITYLEVEL', 'vcrbw.COMMODITYCODE','vcrbw.YEARTERM'];
  colOrders: string[] = ['asc', 'asc', 'asc'];
  colNamesPbar: string[] = ['b.baseYear', 'cpip.commodityCode'];
  colOrdersPbar: string[] = ['asc', 'asc'];
  @Input() provinceId: ProvinceRes;
  @Input() indexGroup: any;
  @Input() regionId: any;
  @Input() stepper: MatStepper;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  @Input() stage40: number;
  province: ProvinceRes;
  @Input() filterProvinceControl: FormControl;
  avgBaseWeightReq = new AvgBaseWeightReq();
  constructor(
    private loading: NgxSpinnerService,
    private rebaseService: RebaseServiceService

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
    this.conditionWbar.yearTerm = true;
    // this.conditionWbar.monthTerm = true;
    this.conditionWbar.commodityCode = true;
    this.conditionWbar.commodityName = true;
    this.conditionWbar.btnSearch = true;
    this.wbarFilter.conditionInput(this.conditionWbar);
    this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
  }


  public getBaseWeight(pageEvent: PageEvent, requestWbarFilter: ConditonGetBaseWeight, avgBaseWeightReq: AvgBaseWeightReq): void {
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
    requestParam.condition = requestWbarFilter;
    requestParam.avgBaseWeightReq = avgBaseWeightReq;
    this.loading.show();
    this.rebaseService.getBaseWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<BaseWeight>(resp.data);
        this.length = resp.dataSize;
        console.log(resp);
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      });
  }


  sortChangeWbar(e: Sort) {
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
    this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
  }

  pageChange(e: PageEvent): PageEvent {
    this.pageEvent = e;
    this.getBaseWeight(e, this.requestWbarFilter, this.avgBaseWeightReq);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportBaseWeight(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'base_weight_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  onSearch(status) {
    console.log("status", status);
    if (status) {
      let filter = this.wbarFilter.getConditionFilter();
      this.requestWbarFilter.commodityCode = filter.commodityCode;
      this.requestWbarFilter.commodityName = filter.commodityName;
      this.requestWbarFilter.monthTerm = filter.monthTerm;
      this.requestWbarFilter.yearTerm = filter.yearTerm;
      this.pageEvent.pageIndex = 0;
      this.getBaseWeight(this.pageEvent, this.requestWbarFilter, this.avgBaseWeightReq);
    }
  }

  changeStage() {
    this.stage.emit(5.33);
  }

  goNext() {
    this.step.emit(this.stepper)
  }

}
