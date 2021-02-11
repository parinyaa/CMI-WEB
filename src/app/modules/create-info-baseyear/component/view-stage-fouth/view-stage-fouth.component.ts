import { ConditionGetBaseIndex } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort, MatStepper, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {BaseIndex, BasePrice} from '../../models/response-data';
import {RebaseServiceService} from '../../../../core/service/rebase/rebase-service.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AvgBaseWeightReq, ProvinceRes, RequestParam} from '../../models/request-param';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-stage-fouth',
  templateUrl: './view-stage-fouth.component.html',
  styleUrls: ['./view-stage-fouth.component.scss']
})
export class ViewStageFouthComponent implements OnInit {
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  displayedColumns: string[] = ['commodityLevel','commodityCode','commodityName','yearTerm',
                                'index01','index02','index03','index04','index05','index06','index07',
                                'index08','index09','index10','index11','index12','indexAvg'];
  //เก่า
  // columns: string[] = ['e.year_term', 'e.month_term','cpa.commodity_code' ,'cpa.commodity_th_name',
  //   'cpa.commodity_level', 'e.index_value'];
  // columns: string[] = ['vcrbi.COMMODITYLEVEL','vcrbi.COMMODITYCODE' ,'vcrbi.COMMODITYNAME', 'vcrbi.YEARTERM '];
    columns: string[] = ['vcrbi.COMMODITYLEVEL','vcrbi.COMMODITYCODE' ,'vcrbi.COMMODITYNAME', 'vcrbi.YEARTERM ',
    'vcrbi.INDEX_01','vcrbi.INDEX_02' ,'vcrbi.INDEX_03' ,
    'vcrbi.INDEX_04' ,'vcrbi.INDEX_05' ,'vcrbi.INDEX_06' ,
    'vcrbi.INDEX_07' ,'vcrbi.INDEX_08' ,'vcrbi.INDEX_09',
    'vcrbi.INDEX_10' ,'vcrbi.INDEX_11','vcrbi.INDEX_12' ,
    'vcrbi.INDEX_AVG '];
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<BaseIndex>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  condition = new ConditionFilter();
  requestFilter = new ConditionGetBaseIndex();
  //เก่า
  // colNames: string[] = ['e.year_term', 'e.month_term','cpa.commodity_code'];
  colNames: string[] = ['vcrbi.COMMODITYLEVEL','vcrbi.COMMODITYCODE' ,'vcrbi.COMMODITYNAME','vcrbi.YEARTERM'];
  colOrders: string[] = ['asc','asc','asc','asc'];
  @Input() provinceId: any;
  @Input() indexGroup: any;
  @Input() regionId: any;
  @Input() stepper: MatStepper;
  @Output() step = new EventEmitter<any>();
  @Output() stage = new EventEmitter<any>();
  province : ProvinceRes;
  @Input() filterProvinceControl: FormControl;
  @Input() stage40: number;
  avgBaseWeightReq = new AvgBaseWeightReq();
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.condition.yearTerm = true;
    // this.condition.monthTerm = true;
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
  }

  ngOnInit() {

  }

  public preparePage(): void {
    console.log('stage40 === ',this.stage40);
    
    this.avgBaseWeightReq.indexGroup = this.indexGroup === null ? null :this.indexGroup.paramId;
    
 
if(this.filterProvinceControl.value) {
  this.province = this.filterProvinceControl.value
  this.avgBaseWeightReq.provinceId = this.province === null ? null :this.province.provinceId;;

} else {
  this.avgBaseWeightReq.regionId = this.regionId === null ? null :this.regionId.regionId;;
}
    
    this.sort = new MatSort();
    this.sort.active = '0';
    this.sort.direction = 'asc';
    this.filterDataComponent.conditionInput(this.condition);
    this.getBaseIndex(this.pageEvent , this.requestFilter,this.avgBaseWeightReq);
  }

  goNext(){
    this.step.emit(this.stepper)
  }

  public getBaseIndex(pageEvent: PageEvent ,requestFilter :ConditionGetBaseIndex, avgBaseWeightReq: AvgBaseWeightReq): void {
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
    this.loading.show();
    this.rebaseService.getBaseIndex(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<BaseIndex>(resp.data);
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

  sortChange(e: Sort) {
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

    this.getBaseIndex(this.pageEvent , this.requestFilter,this.avgBaseWeightReq);
  }
  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getBaseIndex(e , this.requestFilter,this.avgBaseWeightReq);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportBaseIndex(this.avgBaseWeightReq).subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'base_index_' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  onSearch(status){
    if(status){
      let filter = this.filterDataComponent.getConditionFilter();
      this.requestFilter.yearTerm = filter.yearTerm;
      // this.requestFilter.monthTerm = filter.monthTerm;
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName= filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getBaseIndex(this.pageEvent ,  this.requestFilter,this.avgBaseWeightReq);
    }
  }

  changeStage() {
    this.stage.emit(5.4);
  }

}
