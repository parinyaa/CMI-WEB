import { ConditionGetSopAvgWeight } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';
import { FilterDataComponent } from './../filter-data/filter-data.component';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource, PageEvent, Sort} from '@angular/material';
import {AvgBaseWeight, SopAvgWeight} from '../../models/response-data';
import {RebaseServiceService} from '../../../../core/service/rebase/rebase-service.service';
import {NgxSpinnerService} from 'ngx-spinner';
import FileSaver from 'file-saver';
import {RequestParam} from '../../models/request-param';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

@Component({
  selector: 'app-view-stage-nine',
  templateUrl: './view-stage-nine.component.html',
  styleUrls: ['./view-stage-nine.component.scss']
})
export class ViewStageNineComponent implements OnInit {
  @ViewChild(FilterDataComponent, { static: false }) filterDataComponent: FilterDataComponent;
  displayedColumns: string[] = ['0', '1', '2', '3','4'];
  columns: string[] = ['p.baseYear', 'pms.commodityCode','pms.commodityThName',
    'pms.commodityLevel', 'averageWeight'];
  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<SopAvgWeight>();
  sortMap: Map<string, MatSort> = new Map<string, MatSort>();
  condition =  new ConditionFilter();
  requestFilter = new ConditionGetSopAvgWeight();
  colNames: string[] = ['pms.commodityCode'];
  colOrders: string[] = ['asc'];
  constructor(
    private rebaseService: RebaseServiceService,
    private loading: NgxSpinnerService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
    this.condition.commodityCode = true;
    this.condition.commodityName = true;
    this.condition.btnSearch = true;
  }

  ngOnInit() {

  }

  public preparePage(): void {
    this.sort = new MatSort();
    this.sort.active = '2';
    this.sort.direction = 'asc';
    this.filterDataComponent.conditionInput(this.condition);
    this.getAvgBaseWeight(this.pageEvent , this.requestFilter);
  }
  public getAvgBaseWeight(pageEvent: PageEvent , requestFilter :ConditionGetSopAvgWeight): void {
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
    this.loading.show();
    this.rebaseService.getSopAvgWeight(requestParam).subscribe(
      (resp) => {
        this.dataSource = new MatTableDataSource<SopAvgWeight>(resp.data);
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

    this.getAvgBaseWeight(this.pageEvent , this.requestFilter);
  }

  pageChange(e: PageEvent): PageEvent {
    console.log(e);
    this.getAvgBaseWeight(e , this.requestFilter);
    return e;
  }

  export(): void {
    this.loading.show();
    this.rebaseService.exportSopAvgWeight().subscribe(
      (res) => {
        const mediaType = 'application/octet-stream';
        const blob = new Blob([res], { type: mediaType });
        console.log('blob', blob);
        FileSaver.saveAs(blob, 'sop-avg-weight' + new Date().toISOString() + '.csv');
        this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
  }

  onSearch(status){
    if(status){
      this.colNames = ['pms.commodityCode'];
      this.colOrders = ['asc'];
      let filter = this.filterDataComponent.getConditionFilter();
      this.requestFilter.commodityCode = filter.commodityCode;
      this.requestFilter.commodityName= filter.commodityName;
      this.pageEvent.pageIndex = 0;
      this.getAvgBaseWeight(this.pageEvent ,  this.requestFilter);
    }
  }

}
