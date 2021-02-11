import { DataconfigService } from './../../core/service/dataconfig/dataconfig.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DataConfigCreateRequest, ExportSourceByCpaRequest, FilterCpaMinus } from './../../shared/models/dataconfig/DataConfigCreateRequest';
import { DataConfigListRequest } from './../../shared/models/dataconfig/DataConfigListRequest';
import { MatTableDataSource, MatSort, PageEvent } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { CpaPageableRequset } from './../../shared/models/ppitree/request/CpaPageableRequest';
import { PpitreeService } from './../../core/service/ppitree/ppitree.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { ProvinceService } from 'src/app/core/service/province/province.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ProvinceResponse } from 'src/app/shared/models/responses/provinceResponse';
import { RegionResponse } from 'src/app/shared/models/responses/regionResponse';
import { map, startWith } from 'rxjs/operators';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from '../master-params/model/param';
import * as FileSaver from 'file-saver';
declare var $: any;
@Component({
  selector: 'app-master-mappspec',
  templateUrl: './master-mappspec.component.html',
  styleUrls: ['./master-mappspec.component.scss']
})
export class MasterMappspecComponent implements OnInit {
  @ViewChild("successSurveySwal", { static: false }) successSurveySwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  page = 0;
  pageSize = 10;
  dataSource = new MatTableDataSource();
  totalRecordSource: number;
  totalRecords: number;
  divTable = true;
  divMap = false;
  statusSave = false;
  searchObj = { searchType: 0, commodityCode: "", commodityName: "" ,provinceName: ""};
  filterList = [
    { 'type': 1, 'name': "รหัสแหล่งข้อมูล" },
    { 'type': 2, 'name': "ชื่อแหล่งข้มูล" },
  ]
  typeFilter = 1;
  placeholderFilter = "ค้นหารหัสแหล่งข้อมูล";
  commodityActive: any;
  source = new Array();
  sourceFilter = new Array();
  sourceMapping = new Array();
  sourceMappingFilter = new Array();
  searchSource: string = "";
  searchSourceMapping: string;
  displayedColumns: string[] = ['commodityCode', 'commodityThName', 'frequency', 'countSource', 'action'];
  pageSizeSource = 50;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent = new PageEvent();
  userProfile: any;
  listUserProfile: any;
  checkProvinceId: boolean = false;
  listProvince: Array<ProvinceResponse> = [];
  test: string;
  filterProvinceOptions: Observable<any[]>;
  filterProvinceControl = new FormControl();
  constructor(
    private ppitreeService: PpitreeService,
    private cpaPageableRequset: CpaPageableRequset,
    private loading: NgxSpinnerService,
    private dataConfigListRequest: DataConfigListRequest,
    private dataConfigCreateRequest: DataConfigCreateRequest,
    private dataconfigService: DataconfigService,
    private sessionService: SessionServiceService,
    private provinceService: ProvinceService,
    private paramService: ParamService,

  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSizeSource;
    
    
  }

  ngOnInit() {
    this.setSelectProvince();
   
    
    // this.getUserProfile();
    // this.setSelectProvince();
    // this.filterProvince(this.listProvince);
  }

  getCpaPageable(page: number, pageSize: number) {
    this.loading.show();
    this.cpaPageableRequset.page = page;
    this.cpaPageableRequset.pageSize = pageSize;
    
    this.page = page;
    this.pageSize = pageSize;
    this.cpaPageableRequset.field = "";
    console.log(this.cpaPageableRequset);
    console.log(this.cpaPageableRequset.provinceName);
    this.cpaPageableRequset.provinceId = this.filterProvinceControl.value ? this.filterProvinceControl.value.provinceId : 0;
    
    this.ppitreeService.getCpaPageable(this.cpaPageableRequset).subscribe(
      (res) => {
        console.log(res.content)
        this.loading.hide();
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.sort = this.sort;
        this.totalRecords = res.totalRecords;
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  private _filterProvinceList(province: string): any[] {
    const filterValue = province;
    let selectProvince :any;
      selectProvince = this.listProvince.filter(option =>

        option.provinceName.toString().startsWith(filterValue) || option.provinceCode.toString().startsWith(filterValue)
      )

   

    return selectProvince;
  }

  displayFilterProvince(province?: ProvinceResponse): string | undefined {
    console.log('displayFilterProvince === ', province);
    if(province) {
      return   province ? province.provinceCode +' ' + province.provinceName : undefined;

    }
  }

  getUserProfile() {
    this.userProfile = this.sessionService.getUserProfile();
    console.log('userProfile === ',this.userProfile);
    
    if (this.userProfile.provinceId !== null) {
      this.listUserProfile = this.userProfile.provinceId;
      console.log('listUserProfile === ',this.listUserProfile);


      this.filterProvinceControl.setValue(this._filterProvinceList(this.userProfile.localFirstName)[0]);
      // this.cpaPageableRequset.provinceName =this.searchObj.provinceName;
      this.cpaPageableRequset.provinceName = this.filterProvinceControl.value.provinceName;
      this.filterProvinceControl.disable();
      
      
      this.checkProvinceId = true;
    } else {
      this.listUserProfile = 0;
      this.filterProvinceControl.setValue(this.listProvince.find((x => x.provinceName === 'กรุงเทพมหานคร')));
      console.log('this.filterProvinceControl ',this.filterProvinceControl.value);
      
      this.searchObj.provinceName = this.filterProvinceControl.value.provinceName;
    }
  }

  setSelectProvince() {
    this.provinceService.getProvinceAll().subscribe(
      (res) => {
        this.listProvince = res;
        // let province = new ProvinceResponse();
        // let region = new RegionResponse();
        // region.regionCode = '0';
        // region.regionId = 0;
        // region.regionName = 'ทั้งหมด';
        // region.regionNameEn = 'ทั้งหมด';
        // province.provinceCode = 0;
        // province.provinceId = 0;
        // province.provinceName = 'ทั้งหมด'
        // province.cpipMsRegion = region;
        // this.listProvince.push(province)
      
        this.filterProvinceOptions = this.filterProvinceControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            console.log(value);
  
  
            return value ? this._filterProvinceList(value) : this.listProvince.slice();
          })
        );
        console.log('this.listProvince === ',this.listProvince);
        
        this.getUserProfile();
        this.getCpaPageable(this.page, this.pageSize);
        
      },
      (error) => {},
    );
  }

  updatePagination(event) {
    this.getCpaPageable(event.pageIndex, event.pageSize);
  }

  onSearch() {
    
    this.cpaPageableRequset.commodityCode = this.searchObj.commodityCode;
    this.cpaPageableRequset.commodityName = this.searchObj.commodityName;
    this.cpaPageableRequset.searchType = this.searchObj.searchType;
    
    console.log(this.filterProvinceControl.value.provinceName);
    
    if (this.userProfile.provinceId !== null) {
      // this.searchObj.provinceName = this.filterProvince(this.listUserProfile);
      this.filterProvinceControl.setValue(this._filterProvinceList(this.userProfile.localFirstName)[0]);
      // this.cpaPageableRequset.provinceName =this.searchObj.provinceName;
      this.cpaPageableRequset.provinceName =this.filterProvinceControl.value.provinceName;
    } else {
      //  this.cpaPageableRequset.provinceName = this.searchObj.provinceName;
       this.cpaPageableRequset.provinceName = this.filterProvinceControl.value.provinceName;
    }
  
    this.page = 0;
    // if(this.cpaPageableRequset.commodityCode !== '' || this.cpaPageableRequset.commodityName !== '') {
      this.getCpaPageable(this.page, this.pageSize);

   
    
  }

  filterProvince(listUserProfile:number){
    const province = this.listProvince.find(province => {
      console.log(province);
      
      return province.provinceId === listUserProfile;
      
    });
    return province.provinceName;
  }

  openDivMap(element) {
    $(".divTable").slideUp();
    this.divMap = true;
    // this.divTable = false;
    this.searchSource = "";
    this.commodityActive = element;
    this.getSourceByCpa(this.pageEvent);
  }

  closeDivMap() {
    $(".divTable").slideDown();
    $(".divMap").slideDown();
    this.divMap = false;
    // this.divTable = true;
    this.source = [];
    this.sourceMapping = [];
    if (this.statusSave) {
      this.statusSave = false;
      this.getCpaPageable(this.page, this.pageSize);
    }
  }

  getSourceByCpa(pageEvent: PageEvent) {
    this.loading.show();
    let request = new FilterCpaMinus();
    console.log('filterProvinceControl === ',this.filterProvinceControl.value);
    console.log('this.commodityActive ',this.commodityActive);
    
    request.cpaId = this.commodityActive.cpipId;
    // request.surveyCode = this.typeFilter == 1 ? this.searchSource : "";
    // request.surveyName = this.typeFilter == 2 ? this.searchSource : "";
    // request.sourceCode = this.typeFilter == 3 ? this.searchSource : "";
    // request.sourceName = this.typeFilter == 4 ? this.searchSource : "";

    request.sourceCode = this.typeFilter == 1 ? this.searchSource : "";
    request.sourceName = this.typeFilter == 2 ? this.searchSource : "";
    request.provinceId = this.filterProvinceControl.value ? this.filterProvinceControl.value.provinceId : 0;
    console.log("request", request);
    console.log("request", this.typeFilter );
    this.ppitreeService.getSourceByCpa(request, pageEvent.pageIndex, pageEvent.pageSize).subscribe(
      (res) => {
        console.log(res);
        this.loading.hide();
        res.source.content.forEach((obj, i) => obj.seleted = false);
        this.source = res.source.content;
        this.totalRecordSource = res.source.totalRecords
        this.sourceFilter = res.source.content;
        this.sourceMapping = res.sourceMapping;
        this.sourceMappingFilter = res.sourceMapping;
        console.log(this.source);
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  export() {
    this.loading.show();
    let request = new ExportSourceByCpaRequest();
    request.provinceId = this.filterProvinceControl.value ? this.filterProvinceControl.value.provinceId : null;
    request.cpaId = this.commodityActive.cpipId;
    this.ppitreeService.exportSourceByCpa(request).subscribe(
      (res) => {
        console.log(res);

        let mediaType = 'application/octet-stream';
          const blob = new Blob([res], { type: mediaType });
          console.log('blob', blob);
          FileSaver.saveAs(
            blob,
            'รหัสสินค้า_'+this.commodityActive.commodityCode + '_' + new Date().toISOString() + '.xlsx',
          );
          this.loading.hide();
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    );
    
  }

  onSortData(e) {
    console.log('eeeeee  ',e);
    
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'commodityCode': {
          return item[e.active];
          // return item['cpipMsCpip'].commodityCode;
        }
        case 'commodityName': {
          return item[e.active];
          // return item['cpipMsCpip'].commodityThName;
        }
        case 'frequency': {
          return item[e.active];
          // return item['cpipMsCpip'].frequency != null ? item['cpipMsCpip'].frequency.paramLocalDescription : ""
        }
        case 'countMap': {
          return item[e.active];
          // return item['countSource'];
        }
        default: return item[property];
      }
    };
  }

  onFilterSource(event) {
    if (this.typeFilter == 1) {
      //ชื่อแหล่งข้อมูล
      this.source = this.sourceFilter.filter(option => option.sourceName.includes(event));
    }
    else if (this.typeFilter == 2) {
      //ชื่อผู้ให้ข้อมูล
      this.source = this.sourceFilter.filter(option => option.survey.surveyName.includes(event));
    }
    else if (this.typeFilter == 3) {
      //รหัสแหล่งข้อมูล
      this.source = this.sourceFilter.filter(option => option.sourceCode.includes(event));
    }
    else if (this.typeFilter == 4) {
      //จังหวัดแหล่งข้อมูล
      this.source = this.sourceFilter.filter(option => option.province.provinceName.includes(event));
    }
  }

  onFilterSourceMapping(event) {
    this.sourceMapping = this.sourceMappingFilter.filter(option => option.sourceName.includes(event));
  }

  filterType(event) {
    this.placeholderFilter = "ค้นหา" + event.name;
    if (event.type == 1) {
      this.typeFilter = 1;
    }
    else if (event.type == 2) {
      this.typeFilter = 2;
    } 
  }

  selectionChange(e) {
    if (!e.option._selected) {
      e.option._value.seleted = false;
    } else {
      e.source._value.forEach((obj, i) => obj.seleted = true);
    }
  }

  onSave() {
    this.loading.show();
    let result = new Array();
    console.log("commodityActive",this.commodityActive);
    this.source.forEach(source => {
      let config = new DataConfigListRequest();
      if (source.seleted) {
        config.cpipId = this.commodityActive.cpipMsCpip.cpipId;
        config.sourceId = source.sourceId;
        result.push(config);
      }
    });
    this.dataConfigCreateRequest.dataConfig = result;
    if (result.length > 0) {
      console.log(this.dataConfigCreateRequest);
      this.dataconfigService.createDataConfig(this.dataConfigCreateRequest).subscribe(
        (res) => {
          this.loading.hide();
          this.statusSave = true;
          this.successSurveySwal.show();
        },
        (error) => {
          this.loading.hide();
        }
      )
    } else {
      this.loading.hide();
    }
  }

  updatePaginationSource(e) {
    this.pageEvent.pageIndex = e.pageIndex;
    this.pageEvent.pageSize = e.pageSize;
    this.getSourceByCpa(this.pageEvent);
  }

  onSearchSource() {
    this.getSourceByCpa(this.pageEvent);
  }

  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }

}
