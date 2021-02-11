import { RequestParam } from './../../../create-info-baseyear/models/request-param';
import { ParamService } from 'src/app/core/service/param/param.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataconfigService } from './../../../../core/service/dataconfig/dataconfig.service';
import { element } from 'protractor';
import { DataConfigListRequest } from './../../../../shared/models/dataconfig/DataConfigListRequest';
import { CpipMsDadaConfigRequest, DataConfigCreateRequest, FilterCpaMinusSource } from './../../../../shared/models/dataconfig/DataConfigCreateRequest';
import { MatTableDataSource, MatSelectionList, PageEvent, MatSort } from '@angular/material';
import { PpitreeService } from './../../../../core/service/ppitree/ppitree.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SourcePageableRequest } from 'src/app/shared/models/source/request/sourcepageablerequest';
import { Pageable } from './../../../../shared/models/survey/request/pageable';
import { SortedList } from 'src/app/shared/models/survey/request/sortedList';
import { SourceService } from 'src/app/core/service/source/source.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { View } from '@fullcalendar/core';
import { ParamGroup } from 'src/app/shared/common/GetParam';
import { ParamInfo } from 'src/app/modules/master-params/model/param';

@Component({
  selector: 'app-data-config',
  templateUrl: './data-config.component.html',
  styleUrls: ['./data-config.component.scss']
})
export class DataConfigComponent implements OnInit {
  @ViewChild("successSurveySwal", { static: false }) successSurveySwal: SwalComponent;
  @ViewChild("deleteDataConfig", { static: false }) deleteDataConfigSwal: SwalComponent;
  @ViewChild("successSaveSwal", { static: false }) successSaveSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  surveyCode: string;
  surveyName: string;
  @Input()
  sourceCode:string;
  @Input()
  sourceParent:any;
  sourceNameActive: string;
  sourceIdActive: number;
  cpaList: any;
  cpaListFilter = new Array();
  sourceList: any;
  sourceActive: string;
  divCpa = false;
  loadBar = false;
  searchText: string;
  searchDataConfig: string;
  dataConfigList: any;
  dataConfigFilter: any;
  cpaCategory: any;
  dataConfigOrder = new Array();
  length = 100;
  pageSize = 10;
  totalRecords = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  displayedColumns: string[] = ['0', '1', '2'];
  filterList = [{ name: 'รหัสรายการ', status: 0 }, { name: 'ชื่อรายการ', status: 1 }];
  filterType = 0;
  columns: string[] = ['yearTerm', 'monthTerm', 'pms.commodityCode'];
  constructor(
    private sourceService: SourceService,
    private sourcePageableRequest: SourcePageableRequest,
    private pageable: Pageable,
    private sortedList: SortedList,
    private loading: NgxSpinnerService,
    private router: Router,
    private ppitreeService: PpitreeService,
    private dataConfigCreateRequest: DataConfigCreateRequest,
    private dataConfigListRequest: DataConfigListRequest,
    private dataconfigService: DataconfigService,
    private paramService: ParamService

  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }
  ngOnInit() {
    // this.sourceCode = history.state['sourceCode'].sourceCode;
    this.sourceCode =  this.sourceCode ?  this.sourceCode : null;
    // console.log(this.sourceCode);
    // this.getSource();
    this.selectSource(this.sourceParent);
    this.getParams(); 
  }

  getParams() {
    this.cpaCategory = this.paramService.getParamByGroup(ParamGroup.cpaCategory).sort(function (a, b) {
      return a.orderNo - b.orderNo;
    });
  }

  getSource() {
    this.loading.show();
    var sortList = new Array<SortedList>();
    this.pageable.page = 1;
    this.pageable.size = 10000;
    this.sortedList.field = "string";
    this.sortedList.direction = "ASC";
    sortList.push(this.sortedList);
    this.pageable.sortedList = sortList;
    this.sourcePageableRequest.pageable = this.pageable;
    this.sourcePageableRequest.sourceCode = this.sourceCode;
    console.log('res page',this.sourcePageableRequest);
    this.sourceService.getSource(this.sourcePageableRequest).subscribe(
      (res) => {
        this.loading.hide();
        console.log(res);
        console.log('serveyName res',res.data[0].source)
        this.sourceList = res.data;
        this.selectSource(res.data[0].source);

      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  getDataConfig(source) {
    let request = new CpipMsDadaConfigRequest();
    request.provinceId = source.province.provinceId;
    request.sourceId = source.sourceId;
    console.log('request === ',request);
    
    this.divCpa = true;
    this.loadBar = true;
    this.loading.show();
    this.dataconfigService.getMappingDataConfig(request).subscribe(
      (res) => {
        this.dataConfigList = res;
        this.dataConfigFilter = res;
        
        // this.getCapSource(this.pageEvent, sourceId);
        this.dataConfigOrderCategory(this.dataConfigList);
        console.log(res);
      }, (error) => {
        this.loadBar = false;
        this.loading.hide();
        console.log(error);
      }
    )
  }

  public getCapSource(pageEvent: PageEvent, sourceId: number): void {
    let code: string = "";
    let name: string = "";
    if (this.filterType == 0) {
      code = this.searchText;
    } else if (this.filterType == 1) {
      name = this.searchText;
    }
    let request = new FilterCpaMinusSource();
    request.sourceId = sourceId;
    request.filterName = name;
    request.filterCode = code;
    console.log("request", request);
    this.ppitreeService.getCpaBySource(request, pageEvent.pageIndex, pageEvent.pageSize).subscribe(
      (res) => {
        this.loadBar = false;
        this.divCpa = true;
        this.totalRecords = res.totalRecords;
        res.content.forEach((obj, i) => obj.seleted = false);
        this.cpaList = res.content;
        this.cpaListFilter = res.content;
      }, (error) => {
        this.loadBar = false;
        console.log(error);
      });
  }

  dataConfigOrderCategory(data) {
    this.dataConfigOrder = [];
    if (this.cpaCategory) {
      this.cpaCategory.forEach(element => {
        let res = { type: element.paramInfo, typeName: element.paramLocalMessage, data: [] };
        data.forEach(element => {
          // console.log('element config',element)
          let typeCode = element.commodityCode;
          let type = typeCode.substring(0, 1);
          if (type == res.type) {
            res.data.push(element);
          }
        });
        this.dataConfigOrder.push(res);
        this.loadBar = false;
      });
    }
    this.loading.hide();
  }


  selectSource(source) {
    console.log(source);
    this.searchText = "";
    this.sourceActive = source.sourceCode;
    this.sourceNameActive = source.sourceName;
    this.sourceIdActive = source.sourceId;
    this.getDataConfig(source);
  }

  filterCapList(e) {
    this.cpaListFilter = this.cpaList.filter(option => option.commodityName.includes(e));
  }

  filterDataConfig(e) {

    this.dataConfigFilter = this.dataConfigList.filter(option => option.commodityThName.includes(e)
     || option.commodityCode.includes(e));
    this.dataConfigOrderCategory(this.dataConfigFilter);
  }

  selectionChange(e) {
    if (!e.option._selected) {
      e.option._value.seleted = false;
    } else {
      e.source._value.forEach((obj, i) => obj.seleted = true);
    }
  }

  onSaveCpa() {
    this.loading.show();
    let listConfig = new Array();
    this.cpaList.forEach(element => {
      console.log('element save',element)
      let config = new DataConfigListRequest();
      if (element.seleted) {
        config.cpipId = element.cpaId;
        config.sourceId = this.sourceIdActive;
        listConfig.push(config);
      }
    });
    this.dataConfigCreateRequest.dataConfig = listConfig;
    console.log('gsdfgsdfg',this.dataConfigCreateRequest.dataConfig)
    this.dataconfigService.createDataConfig(this.dataConfigCreateRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.successSaveSwal.show();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
    console.log("cpaList", this.cpaList);
    console.log("listConfig", this.dataConfigCreateRequest);
  }

  updatePagination(e) {
    console.log(e);
    this.pageEvent.pageIndex = e.pageIndex;
    this.pageEvent.pageSize = e.pageSize;
    this.getCapSource(this.pageEvent, this.sourceIdActive);
  }

  filterChange(f) {
    this.filterType = f.status;
  }

  searchFilter() {
    this.getCapSource(this.pageEvent, this.sourceIdActive);
  }

  delete(data) {
    this.deleteDataConfigSwal.show().then((result) => {
      if (result.value) {
        this.loading.show();
        this.dataconfigService.deleteDataConfig(data.dataConfigId).subscribe((res) => {
          this.loading.hide();
          this.successSurveySwal.title = "ลบสำเร็จ";
          this.successSurveySwal.show();
        }, (error) => {
          this.loading.hide();
        })
      }
    });
  }

  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }


}
