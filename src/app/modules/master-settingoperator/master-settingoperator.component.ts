import { DataConfigSearchRequest } from './../../shared/models/dataconfig/DataConfigSearchRequest';
import { DataMatrixCreateRequest, DataMatrixList } from './../../shared/models/datamatrix/DataMatrixCreateRequest';
import { ProvinceService } from './../../core/service/province/province.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { element } from 'protractor';
import { DataconfigService } from './../../core/service/dataconfig/dataconfig.service';
import { DataConfigPageRequest } from './../../shared/models/dataconfig/DataConfigPageRequest';
import { Pageable } from './../../shared/models/survey/request/pageable';
import { SortedList } from 'src/app/shared/models/survey/request/sortedList';
import { DataMatrixPageableRequest } from './../../shared/models/datamatrix/DataMatrixPageableRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatamatrixService } from './../../core/service/datamatrix/datamatrix.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogEditoperatorComponent } from './components/dialog-editoperator/dialog-editoperator.component';
import { DialogAddoperatorComponent } from './components/dialog-addoperator/dialog-addoperator.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialogRef, MatDialog, MatPaginator, Sort } from '@angular/material';

@Component({
  selector: 'app-master-settingoperator',
  templateUrl: './master-settingoperator.component.html',
  styleUrls: ['./master-settingoperator.component.scss']
})
export class MasterSettingoperatorComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('deleteSuccessSwal', { static: false }) deleteSuccessSwal: SwalComponent;
  @ViewChild('alertForEditSwal', { static: false }) alertForEditSwal: SwalComponent;
  @ViewChild('saveSuccessSwal', { static: false }) saveSuccessSwal: SwalComponent;

  dataSource = new MatTableDataSource();
  page = 0;
  pageSize = 10;
  totalRecords: number;
  matrixList: any;
  // userTypeList = [];
  userTypeList: any;
  provinceAll: any;
  resultMatrix: any;
  pageEvent: any;
  searchType: number = 0;
  searchFilter = { searchType: 0, province: "", commodityCode: "", commodityThName: "", sourceName: "" };

  displayedColumns: string[] = ['province', 'sourceCode', 'sourceName', 'commodityCode', 'commodityThName'];

  // displayedColumns: string[] = ['level', 'province', 'sourceCode', 'sourceName', 'commodityCode', 'commodityThName'];
  constructor(
    private dialog: MatDialog,
    private datamatrixService: DatamatrixService,
    private loading: NgxSpinnerService,
    private DataMatrixPageableRequest: DataMatrixPageableRequest,
    private pageable: Pageable,
    private sortedList: SortedList,
    private dataConfigPageRequest: DataConfigPageRequest,
    private dataconfigService: DataconfigService,
    private paramService: ParamService,
    private provinceService: ProvinceService,
    private dataMatrixCreateRequest: DataMatrixCreateRequest,
    private dataMatrixList: DataMatrixList,
    private dataConfigSearchRequest: DataConfigSearchRequest
  ) { }

  ngOnInit() {
    this.setSelectProvince();
    this.paramService.getIamParamAll().subscribe(
      (res) => {
        console.log(res);
        
        this.getUserTypeList(res);
      }
    )
    // this.getDataMatrix();
    // this.getDataConfig(this.page, this.pageSize);
  }

  // getDataMatrix() {
  //   this.loading.show();
  //   this.datamatrixService.getDataMatrixALl().subscribe(
  //     (res) => {
  //       this.loading.hide();
  //       console.log(res);
  //       this.matrixList = res;
  //       this.getDataConfig(this.page, this.pageSize);
  //       this.setSelectProvince();
  //     }, (error) => {
  //       this.loading.hide();
  //       console.log(error);
  //     }
  //   )
  // }

  getDataConfig(page: number, pageSize: number) {
    this.loading.show();
    this.dataConfigSearchRequest.page = page;
    this.dataConfigSearchRequest.pageSize = pageSize;
    console.log("dataConfigSearchRequest",this.dataConfigSearchRequest);
    this.dataconfigService.getDataConfigPageable(this.dataConfigSearchRequest).subscribe(
      (res) => {
        // this.setSelectProvince();
        console.log("Response Data Config => ",res);
        this.loading.hide();
        // this.settMaxtirx(res.content);
        this.resultMatrix = res.content;
        this.dataSource = new MatTableDataSource(res.content);
        this.dataSource.sort = this.sort;
        this.totalRecords = res.totalRecords;
      }, (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  // settMaxtirx(data) {
  //   data.forEach(element => {
  //     let matrix = this.matrixList.find(x => x.dataConfig.dataConfigId == element.dataConfigId);
  //     if (matrix) {
  //       element.matrix = matrix;
  //       element.userType = matrix.userType.paramInfoId;
  //       element.province = matrix.province == null ? matrix.province : matrix.province.provinceId;
  //       element.editFlag = false;
  //     } else {
  //       element.matrix = null;
  //       element.userType = null;
  //       element.province = null;
  //       element.editFlag = false;
  //     }
  //   });
  // }

  openAddDialog() {
    const dialogRef = this.dialog.open(DialogAddoperatorComponent, {
      width: '760px',
      data: '',
      position: {
        top: '10%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openEditDialog(evt) {
    const dialogRef = this.dialog.open(DialogEditoperatorComponent, {
      width: '760px',
      data: evt,
      position: {
        top: '10%',
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onDeleteData(e) {
    this.deleteSuccessSwal.show();
  }

  updatePagination(e) {
    console.log(this.resultMatrix);
    let checkEdit = this.resultMatrix.find(x => x.editFlag == true);
    if (checkEdit) {
      this.alertForEditSwal.show();
    } else {
      this.getDataConfig(e.pageIndex, e.pageSize);
    }
  }

  onCancelSave() {
    console.log("this.pageEvent", this.pageEvent);
    if (this.pageEvent.previousPageIndex < this.pageEvent.pageIndex) {
      this.getDataConfig(this.page + 1, this.pageSize);
    } else {
      this.getDataConfig(this.page - 1, this.pageSize);
    }

  }

  getUserTypeList(param) {
    let result = param.find(x => x.paramGroup == "USER_TYPE");
    if (result) {
      // result.paramInfoList.forEach(element => {
      //   if(element.paramInfo === 'PERMANANT_CENTRAL' || element.paramInfo === 'PROVINCE_USER') {
      //     this.userTypeList.push(element);
      //   }
      // });
      this.userTypeList = result.paramInfoList;
    }
  }

  setSelectProvince() {
    this.provinceService.getProvinceAll()
      .subscribe(
        (res) => {
          console.log(res);
          this.provinceAll = res;
          let provinceGetOne = this.provinceAll.find((x => x.provinceName === 'กรุงเทพมหานคร'))
          // this.provinceAll.length > 0 ? this.provinceAll[1] : null;
          this.searchFilter.province = provinceGetOne.provinceName;
          this.dataConfigSearchRequest.province = this.searchFilter.province;
          this.getDataConfig(this.page, this.pageSize);
        },
        (error) => {
          this.provinceAll = [];
        }
      )
  }

  openSelectProvince(e) {
    if (e.userType) {
      let params = this.userTypeList.find(x => x.paramInfoId == e.userType);
      if (params && params.paramInfo == "PROVINCE_USER") {
        return true;
      } else {
        return false;
      }
    }
  }

  selectUserType(event, element) {
    if (event == null) {
      element.province = null;
      element.editFlag = false;
    } else {
      let params = this.userTypeList.find(x => x.paramInfoId == event);
      if (params && params.paramInfo != "PROVINCE_USER") {
        element.editFlag = true;
      } else {
        element.editFlag = false;
      }
    }
  }

  onChangeProvince(event, element) {
    element.editFlag = true;
  }

  onSave() {
    this.loading.show();
    this.dataMatrixCreateRequest.dataMatrix = [];
    // tslint:disable-next-line:no-shadowed-variable
    this.resultMatrix.forEach(element => {
      console.log("element", element);
      this.dataMatrixList = new DataMatrixList();
      if (element.editFlag) {
        this.dataMatrixList.dataConfig = element.cpipMsDataConfigs.dataConfigId;
        this.dataMatrixList.userType = element.userType;
        this.dataMatrixList.province = element.province;
        console.log(this.dataMatrixList.dataConfig)
        console.log(this.dataMatrixList.userType)
        console.log(this.dataMatrixList.province)
        this.dataMatrixCreateRequest.dataMatrix.push(this.dataMatrixList);
      }
    });
    if (this.dataMatrixCreateRequest.dataMatrix.length) {
      console.log("this.dataMatrixCreateRequest", this.dataMatrixCreateRequest);
      this.datamatrixService.createDataMatrix(this.dataMatrixCreateRequest).subscribe(
        (res) => {
          this.loading.hide();
          this.saveSuccessSwal.show();
        }, (error) => {
          console.log(error);
          this.loading.hide();
        }
      )
    } else {
      this.loading.hide();
    }
  }

  onSearch() {
    this.dataConfigSearchRequest.page = 0;
    this.dataConfigSearchRequest.pageSize = 10;
    this.dataConfigSearchRequest.searchType = this.searchFilter.searchType;
    this.dataConfigSearchRequest.province = this.searchFilter.province;
    this.dataConfigSearchRequest.commodityCode = this.searchFilter.commodityCode != null ? this.searchFilter.commodityCode : "";
    this.dataConfigSearchRequest.commodityThName = this.searchFilter.commodityThName != null ? this.searchFilter.commodityThName : "";
    this.dataConfigSearchRequest.sourceName = this.searchFilter.sourceName != null ? this.searchFilter.sourceName : "";
    this.getDataConfig(this.dataConfigSearchRequest.page, this.dataConfigSearchRequest.pageSize);
  }

  onChangeTypeSearch(event) {
    console.log("onChangeTypeSearch", event);
  }

  onSortData(sort: Sort) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'sourceName': {
          return item['cpipMsDataConfigs'].cpipMsSource.sourceName;
        }
        case 'sourceCode': {
          return item['cpipMsDataConfigs'].cpipMsSource.sourceCode;
        }
        case 'commodityCode': {
          return item['cpipMsDataConfigs'].cpipMsCpip.commodityCode;
        }
        case 'commodityThName': {
          return item['cpipMsDataConfigs'].cpipMsCpip.commodityThName;
        }
        default: return item[property];
      }
    };
  }



}