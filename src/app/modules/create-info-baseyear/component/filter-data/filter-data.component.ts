import { Condition } from './../../../../shared/models/conditionFilter/ConditionFilter';
import { ParamGroup } from 'src/app/shared/common/GetParam';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ConditionFilter } from 'src/app/shared/models/conditionFilter/ConditionFilter';

@Component({
  selector: 'app-filter-data',
  templateUrl: './filter-data.component.html',
  styleUrls: ['./filter-data.component.scss']
})
export class FilterDataComponent implements OnInit {
  @Output()
  onSearch:EventEmitter<boolean> = new EventEmitter<boolean>(); 
  monthList = new Array();
  month = new Array();
  baseYearFilter:string = "";
  yearTermFilter:string = "";
  monthTermFilter:string = "";
  commodityCodeFilter:string = "";
  commodityNameFilter:string = "";
  showBaseYear = false;
  showYearTerm = false;
  showMonthTerm = false;
  showCommodityCode = false;
  showCommodityName = false;
  btnSearch = false;
  condition = new Condition();
  constructor(
    private paramService : ParamService
  ) { 
  }

  ngOnInit() {
    this.commodityCodeFilter = "";
    this.getParams();
    console.log("FilterDataComponent");
  }

  conditionInput(condition : ConditionFilter){
      this.baseYearFilter = "";
      this.yearTermFilter = "";
      this.monthTermFilter = "";
      this.commodityCodeFilter = "";
      this.commodityNameFilter = "";
      this.showBaseYear = condition.baseYear;
      this.showYearTerm = condition.yearTerm;
      this.showMonthTerm = condition.monthTerm;
      this.showCommodityCode = condition.commodityCode;
      this.showCommodityName = condition.commodityName;
      this.btnSearch = condition.btnSearch;
      console.log("condition",condition);
  }

  getConditionFilter() : Condition{
      this.condition.baseYear = this.baseYearFilter;
      this.condition.yearTerm = this.yearTermFilter;
      this.condition.monthTerm = this.monthTermFilter!="0"?this.monthTermFilter:"";
      this.condition.commodityCode = this.commodityCodeFilter;
      this.condition.commodityName = this.commodityNameFilter;
      return this.condition
  }

  getParams() {
    this.monthList = this.paramService.getParamByGroup(ParamGroup.month).sort((a, b) => a.orderNo - b.orderNo);
    if (this.monthList) {
      this.monthList.forEach(element => {
        let obj = {name: element.paramLocalMessage, value: element.paramInfo};
        if (this.month.length < 12) {
          this.month.push(obj);
        }
      });
    }
  }

  search() {
    this.onSearch.emit(true);
  }

}
