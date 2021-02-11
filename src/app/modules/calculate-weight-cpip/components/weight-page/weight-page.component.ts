import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {MatPaginator, PageEvent} from '@angular/material';
type AOA = any[][];
import * as XLSX from 'xlsx';
import {NgxSpinnerService} from 'ngx-spinner';
import {BaseyearCpipService} from 'src/app/core/service/baseyearcpip/baseyear-cpip.service';
import {Router} from '@angular/router';
import {StorageService} from 'src/app/core/service/storage/storage.service';
import {IndexMatrixService} from 'src/app/core/service/indexmatrix/index-matrix.service';
import {CheckDataWeightRequest} from 'src/app/shared/models/weight/request/CheckDataWeightRequest.model';
import {WeightCpipService} from 'src/app/core/service/weightcpip/weight-cpip.service';
import {ApplicationConstant} from 'src/app/shared/constants/ApplicationConstant';
import {Message} from 'src/app/shared/message';
import {InsertWeightDataCpipRequest} from 'src/app/shared/models/weight/request/InsertWeightDataRequest.model';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {ParamService} from 'src/app/core/service/param/param.service';
import {InquiryProvinceNameResponse} from '../../../../shared/models/weight/request/InquiryProvinceNameResponse.model';
import {
  WeightCalculateRegionThailand,
  RegionData,
} from 'src/app/shared/models/weight/request/WeightCalculateRegionThailand.model';
import {
  DisabledModel,
  IndexCpipResponseModel,
} from 'src/app/shared/models/index-matrix/CpipMsIndexMatrixRequestForm';

const constants = ApplicationConstant;
@Component({
  selector: 'app-weight-page',
  templateUrl: './weight-page.component.html',
  styleUrls: ['./weight-page.component.scss'],
})
export class WeightPageComponent implements OnInit {
  @ViewChild('openTabFile', {static: true}) openTabFile: any;
  displayedColumns: string[] = ['weightCode', 'description', 'weight'];
  dataSource = [];
  insertWeightDataRequest: InsertWeightDataCpipRequest = new InsertWeightDataCpipRequest();
  @ViewChild('typeFileSwal', {static: false}) typeFileSwal: SwalComponent;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('saveSwal', {static: false}) saveSwal: SwalComponent;
  @ViewChild('saveSucessSwal', {static: false}) saveSucessSwal: SwalComponent;
  @ViewChild('saveErrorSwal', {static: false}) saveErrorSwal: SwalComponent;
  @ViewChild('deleteWeightSuccess', {static: false})
  deleteWeightSuccess: SwalComponent;
  @ViewChild('errorSwal', {static: false}) errorSwal: SwalComponent;
  @ViewChild('calWeightAllSwal', {static: false})
  calWeightAllSwal: SwalComponent;
  @ViewChild('sucesssaveDataSwal', {static: false})
  sucesssaveDataSwal: SwalComponent;
  @ViewChild('alert', {static: false}) alertSwal: SwalComponent;

  afuConfig = {
    uploadAPI: {
      url: 'https://example-file-upload-api',
    },
    formatsAllowed: '.csv,.xlsx',
    maxSize: '20',
    hideResetBtn: true,
    theme: 'dragNDrop',
    replaceTexts: {
      selectFileBtn: 'เลือกไฟล์',
      resetBtn: 'ยกเลิก',
      uploadBtn: 'อัพโหลด',
      dragNDropBox: 'Drag and Drop',
      afterUploadMsg_success: 'อัพโหลดเสร็จสิ้น',
      afterUploadMsg_error: 'อัพโหลดผิดพลาด!',
    },
  };
  disableTab1 = true;
  disableTab2 = true;
  disableTab3 = true;
  disableTab4 = true;

  submitted = false;
  data: any;
  wopts: XLSX.WritingOptions = {bookType: 'xlsx', type: 'array'};
  fileName = 'SheetJS.xlsx';
  isShowTable = false;
  isShowRegionInput = false;
  isShowProvinceInput = false;
  isShowSearch = false;
  isHaveWeight = false;
  TabStep;
  group;
  listBaseYear = new Array();
  listIndexGroup = new Array();
  listIndexMatrix = new Array();
  listIndexMatrixProvince = new Array();
  listProvinceData = new Array<InquiryProvinceNameResponse>();
  weightId;
  weight;
  paramList = new Array();
  baseYear;
  selectedIndex;
  regionId;
  provinceId;
  indexGroup;
  nextStep;
  isNewWeight = false;
  isNewWeightThailand = false;
  newArray = new Array();
  pageSize = 10;
  noDataSource = false;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  length = 0;
  weightStepNo1: any;
  pageEvent: PageEvent = new PageEvent();
  requestDataWeight = new CheckDataWeightRequest();
  checkDisabledInput: DisabledModel;
  hidePage: boolean = true;
  showErorYear: boolean = false;
  requestIndexCpip = new IndexCpipResponseModel();

  sumPercent = 0;
  constructor(
    private loading: NgxSpinnerService,
    private baseyearCpipService: BaseyearCpipService,
    private storageService: StorageService,
    private paramService: ParamService,
    private indexMatrixService: IndexMatrixService,
    private weightService: WeightCpipService,
  ) {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = this.pageSize;
    this.pageEvent.length = this.length;
  }

  ngOnInit(): void {
    this.inquiryBaseYear();
    // this.insertWeightDataRequest.baseYearId = history.state.baseyear.baseYearId;
    // this.insertWeightDataRequest.indexMatrixId = history.state.baseyear.regionId;
    // this.insertWeightDataRequest.paramInfoId = history.state.baseyear.indexGroup;
  }

  deleteWeight() {
    this.loading.show();
    this.weightService.deleteWeight(this.weight.weightId).subscribe(
      (res) => {
        this.loading.hide();
        this.deleteWeightSuccess.show();
        this.dataSource = [];
        this.isShowTable = false;
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      },
    );
  }

  inquiryBaseYear() {
    this.loading.show();
    this.baseyearCpipService.inquiryBaseYear().subscribe(
      (res) => {
        this.loading.hide();
        if (res.code === '200') {
          this.listBaseYear = res.data;
          this.listIndexGroup = this.paramService.getParamByGroup(
            constants.ParamGroup.indexGroup,
          );

          // this.setProvinceData();
        } else {
        }
      },
      (error) => {
        this.loading.hide();
      },
    );
  }
  clear(event) {
    this.hidePage = event;
    this.isShowTable = false;
    console.log('event ========== ', event);
  }

  searchWeight(event) {
    // const request = new CheckDataWeightRequest();
    this.requestDataWeight.baseYearId = this.baseYear;
    this.requestDataWeight.indexGroup = event.indexGroup.paramId;
    this.requestDataWeight.regionId = event.region
      ? event.region.regionId
      : null;
    this.requestDataWeight.provinceId = event.province
      ? event.province.provinceId
      : null;
    event.region ? this.listIndexMatrix.push(event.region) : null;

    this.isHaveWeight = false;
    console.log('this.requestDataWeight === ', this.requestDataWeight);

    if (this.requestDataWeight.baseYearId === undefined) {
      this.showErorYear = true;
      this.alertSwal.title = 'กรุณาเลือกปี';
      this.alertSwal.show();

      return;
    }
    if (!this.showErorYear) {
      this.checkDataweight();
    }
  }

  checkDataweight() {
    this.weightService
      .checkDataweight(this.requestDataWeight)
      .subscribe((res) => {
        let checkInput = new DisabledModel();
        if (res.code === '200') {
          checkInput.searchActive = true;
          this.checkDisabledInput = checkInput;
          if (res.data === null) {
            if (
              this.requestDataWeight &&
              this.requestDataWeight.regionId !== null
            ) {
              console.log(this.listIndexMatrix);

              const region = this.listIndexMatrix.find(
                (element) =>
                  element.regionId === this.requestDataWeight.regionId,
              );

              if (region.regionNameEn === 'THAILAND') {
                this.isNewWeightThailand = true;
                this.isNewWeight = false;
                this.isHaveWeight = false;
              } else {
                this.isNewWeightThailand = false;
                this.isNewWeight = true;
                this.isHaveWeight = false;
              }
            } else {
              this.isNewWeightThailand = false;
              this.isNewWeight = true;
              this.isHaveWeight = false;
            }
          } else {
            this.weight = res.data;
            this.isNewWeightThailand = false;
            this.isNewWeight = false;
            this.isHaveWeight = true;
            if (!this.hidePage) {
              this.checkOpenTab();
            }

            this.weightId = res.data.weightId;
          }
        } else {
          checkInput.searchActive = false;
          this.checkDisabledInput = checkInput;
          this.errorSwal.title = res.message;
          this.errorSwal.show();
        }
      });
  }

  calPercent() {
    this.sumPercent = 0;
    this.listIndexMatrix.forEach(
      (e) =>
        (this.sumPercent =
          this.sumPercent +
          (e.percent === null || e.percent === undefined ? 0 : e.percent)),
    );
  }

  getWeightId() {
    console.log('inbtn');
    this.loading.show();
    this.weightService.getWeightId(this.weightId).subscribe((res) => {
      this.loading.hide();
      if (res.code === '200') {
        if (res.data === null) {
          this.isNewWeight = true;
        } else {
          this.isNewWeight = false;
          this.isHaveWeight = true;
          this.weightId = res.data.weightId;
          this.nextStep = res.data.stepNo;
          this.checkOpenTab();
        }
      } else {
      }
    });
  }

  updateWeight(event) {
    this.weight = event;
    console.log(this.weight);
    this.weight.stepNo = this.weight.stepNo;
    this.weight = event;
    this.isNewWeight = false;
    this.isHaveWeight = true;
    this.checkOpenTab();
    this.weightId = event.weightId;
  }

  checkOpenTab() {
    console.log(this.weight.stepNo);
    if (this.weight.stepNo === 1) {
      this.selectedIndex = 0;
      this.TabStep = 1;
    } else if (this.weight.stepNo === 2) {
      this.selectedIndex = 1;
      this.TabStep = 2;
    } else if (this.weight.stepNo === 3) {
      this.selectedIndex = 2;
      this.TabStep = 3;
    } else if (this.weight.stepNo >= 4) {
      this.selectedIndex = 3;
      this.TabStep = 4;
    }
  }

  checkDisableTab() {
    console.log('step', this.weight.stepNo);
    if (this.weight.stepNo === 1) {
      console.log('step', this.weight.stepNo);
      this.disableTab1 = true;
      this.disableTab2 = true;
      this.disableTab3 = true;
      this.disableTab4 = true;
    } else if (this.weight.stepNo === 2) {
      this.disableTab1 = true;
      this.disableTab2 = true;
      this.disableTab3 = true;
      this.disableTab4 = true;
    } else if (this.weight.stepNo === 3) {
      this.disableTab1 = true;
      this.disableTab2 = true;
      this.disableTab3 = true;
      this.disableTab4 = true;
    } else if (this.weight.stepNo === 4) {
      this.disableTab1 = true;
      this.disableTab2 = true;
      this.disableTab3 = true;
      this.disableTab4 = true;
    }
  }

  refresh() {
    console.log('refresh === ', this.requestDataWeight);

    // this.searchWeight(this.requestDataWeight);
    this.checkDataweight();
    // window.location.reload();
  }

  allowDrop(evt: DragEvent) {
    evt.preventDefault();
  }

  onTabClick(event) {
    if (this.nextStep === 1) {
      this.nextStep = 1;
    } else if (this.nextStep === 2) {
      this.nextStep = 2;
    } else if (this.nextStep === 3) {
      this.nextStep = 3;
    }
  }

  drop(event) {
    event.preventDefault();

    var validExts = new Array('.xlsx', '.xls');
    var fileExt = event.dataTransfer.files[0].name.substring(
      event.dataTransfer.files[0].name.lastIndexOf('.'),
    );
    if (fileExt === '.xlsx' || fileExt === '.xls') {
      this.onDropLoadFile(event);
    } else {
      this.typeFileSwal.show();
    }
  }

  onDropLoadFile(evt: any) {
    this.loading.show();
    this.newArray = [];
    const file = evt.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(ws, {header: 1}) as AOA;
      const data = Object.values(this.data);
      let sumWeight = 0;
      Object.keys(data).forEach((key, index) => {
        if (index !== 0) {
          if (
            data[key][0] !== undefined ||
            data[key][3] !== undefined ||
            data[key][4] !== undefined ||
            data[key][5] !== undefined
          ) {
            let weightCode: string = data[key][4];
            let weightexpenditure = 0;
            if (data[key][4] !== undefined) {
              weightCode = data[key][4];
              weightexpenditure = 0;
            }
            if (
              data[key][0] !== undefined &&
              data[key][3] === undefined &&
              data[key][5] !== undefined && data[key][4] !== undefined
            ) {
              const description: string = data[key][0];
              let descriptionSubstring: string;
              descriptionSubstring = description.substring(
                description.indexOf('.') + 2,
                description.length,
              );
              this.newArray.push({
                weightCode: data[key][4],
                description: descriptionSubstring,
                weight:
                  data[key][5] === undefined
                    ? 0
                    : parseFloat(this.financial(data[key][5])),
              });
            } else if (
              data[key][1] !== undefined &&
              data[key][4] !== undefined
            ) {
              const description: string = data[key][1];
              let descriptionSubstring: string;
              descriptionSubstring = description.substring(
                description.indexOf('.') + 2,
                description.length,
              );
              console.log(descriptionSubstring);
              this.newArray.push({
                weightCode: data[key][4],
                description: descriptionSubstring,
                weight:
                  data[key][5] === undefined
                    ? 0
                    : parseFloat(this.financial(data[key][5])),
              });
            } else if (
              data[key][2] !== undefined &&
              data[key][4] !== undefined
            ) {
              const description: string = data[key][2];
              let descriptionSubstring: string;

              descriptionSubstring = description.substring(
                description.indexOf('-') + 1,
                description.length,
              );
              this.newArray.push({
                weightCode: data[key][4],
                description: descriptionSubstring,
                weight:
                  data[key][5] === undefined
                    ? 0
                    : parseFloat(this.financial(data[key][5])),
              });
            } else if (data[key][3] !== undefined && data[key][4] !== undefined) {
              const description: string = data[key][3];
              let descriptionSubstring: string;
              descriptionSubstring = description.substring(
                description.indexOf('-') + 1,
                description.length,
              );
              if (
                description.indexOf('-') !== -1 ||
                data[key][5] !== undefined
              ) {
                this.newArray.push({
                  weightCode: data[key][4],
                  description: descriptionSubstring,
                  weight:
                    data[key][5] === undefined
                      ? 0
                      : parseFloat(this.financial(data[key][5])),
                });
              }
            }
            if (
              data[key][4] !== undefined &&
              data[key][5] !== undefined &&
              data[key][4].length === 6
            ) {
              if (!isNaN(data[key][5])) {
                sumWeight += parseFloat(this.financial(data[key][5]));
              }
            }
          }
        }
      });
      if (this.newArray.length > 0) {
        this.loading.hide();
        this.dataSource = this.paginate(this.newArray, 10)[0];
        this.paginator.length = this.newArray.length;
      }
    };
    reader.readAsBinaryString(file);
    this.isShowTable = true;
    this.isNewWeight = false;
    this.openTabFile.nativeElement.value = '';
  }

  calWeight(weight: number) {
    return weight * 4.3;
  }

  financial(n) {
    let value = Number.parseFloat(n).toFixed(5);
    return value;
  }

  onFileChange(evt: any) {
    this.loading.show();
    this.newArray = [];
    const target: DataTransfer = evt.target as DataTransfer;
    if (target.files.length !== 1) {
      this.loading.hide();
      return;
    }
    this.fileName = target.files.item(0).name;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(ws, {header: 1}) as AOA;
      const data = Object.values(this.data);
      console.log('file', data);
      let sumWeight = 0;
      Object.keys(data).forEach((key, index) => {
        if (index !== 0) {
          if (
            data[key][0] !== undefined ||
            data[key][3] !== undefined ||
            data[key][4] !== undefined ||
            data[key][5] !== undefined
          ) {
            let weightCode: string = data[key][4];
            let weightexpenditure = 0;
            if (data[key][4] !== undefined) {
              weightCode = data[key][4];
              weightexpenditure = 0;
            }
            if (
              data[key][0] !== undefined &&
              data[key][3] === undefined &&
              data[key][5] !== undefined && data[key][4] !== undefined
            ) {
              const description: string = data[key][0];
              let descriptionSubstring: string;
              descriptionSubstring = description.substring(
                description.indexOf('.') + 2,
                description.length,
              );
              this.newArray.push({
                weightCode: data[key][4],
                description: descriptionSubstring,
                weight:
                  data[key][5] === undefined
                    ? 0
                    : parseFloat(this.financial(data[key][5])),
              });
            } else if (
              data[key][1] !== undefined &&
              data[key][4] !== undefined
            ) {
              const description: string = data[key][1];
              let descriptionSubstring: string;
              descriptionSubstring = description.substring(
                description.indexOf('.') + 2,
                description.length,
              );
              console.log(descriptionSubstring);
              this.newArray.push({
                weightCode: data[key][4],
                description: descriptionSubstring,
                weight:
                  data[key][5] === undefined
                    ? 0
                    : parseFloat(this.financial(data[key][5])),
              });
            } else if (
              data[key][2] !== undefined &&
              data[key][4] !== undefined
            ) {
              const description: string = data[key][2];
              let descriptionSubstring: string;

              descriptionSubstring = description.substring(
                description.indexOf('-') + 1,
                description.length,
              );
              this.newArray.push({
                weightCode: data[key][4],
                description: descriptionSubstring,
                weight:
                  data[key][5] === undefined
                    ? 0
                    : parseFloat(this.financial(data[key][5])),
              });
            } else if (data[key][3] !== undefined && data[key][4] !== undefined) {
              const description: string = data[key][3];
              let descriptionSubstring: string;
              descriptionSubstring = description.substring(
                description.indexOf('-') + 1,
                description.length,
              );
              if (
                description.indexOf('-') !== -1 ||
                data[key][5] !== undefined
              ) {
                this.newArray.push({
                  weightCode: data[key][4],
                  description: descriptionSubstring,
                  weight:
                    data[key][5] === undefined
                      ? 0
                      : parseFloat(this.financial(data[key][5])),
                });
              }
            }
            if (
              data[key][4] !== undefined &&
              data[key][5] !== undefined &&
              data[key][4].length === 6
            ) {
              if (!isNaN(data[key][5])) {
                sumWeight += parseFloat(this.financial(data[key][5]));
              }
            }
          }
        }
      });
      if (this.newArray.length > 0) {
        this.loading.hide();
        this.dataSource = this.paginate(this.newArray, 10)[0];
        this.paginator.length = this.newArray.length;
      }
    };
    reader.readAsBinaryString(target.files[0]);
    this.isShowTable = true;
    this.isNewWeight = false;
    this.openTabFile.nativeElement.value = '';
  }

  paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
      const idx = Math.floor(i / size);
      const page = acc[idx] || (acc[idx] = []);
      page.push(val);

      return acc;
    }, []);
  }

  pageChange(e: PageEvent): PageEvent {
    this.dataSource = this.paginate(this.newArray, e.pageSize)[e.pageIndex];
    return e;
  }

  onSaveSwal() {
    this.saveSwal.title = Message.MESSAGE_SAVE;
    this.saveSwal.show();
  }

  onCalWeightAll() {
    let request = new WeightCalculateRegionThailand();
    let regionData = new RegionData();
    request.baseYearId = this.baseYear;
    request.indexGroupId = String(this.requestDataWeight.indexGroup);
    request.regionDataList = Array<RegionData>();

    var x;
    for (x of this.listIndexMatrix) {
      if (x.regionNameEn !== 'THAILAND') {
        regionData = new RegionData();
        regionData.regionId = x.regionId;
        regionData.percent = x.percent;

        request.regionDataList.push(regionData);
      }
    }
    this.loading.show();
    this.weightService.calWeightThailand(request).subscribe(
      (res) => {
        this.loading.hide();
        this.isShowTable = false;
        this.isHaveWeight = true;
        this.isNewWeightThailand = false;
        this.weightId = res.weightId;

        console.log('logResWeight', res);
        this.weight = res;
        this.checkOpenTab();
        this.checkDisableTab();
        this.saveSucessSwal.title = 'จัดทำน้ำหนักระดับประเทศสำเร็จ';
        this.saveSucessSwal.show();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  calWeightAll() {
    this.calWeightAllSwal.show();
  }

  onSave() {
    this.loading.show();
    this.insertWeightDataRequest.baseYearId = this.baseYear;
    this.insertWeightDataRequest.indexMatrixId = this.requestDataWeight.regionId;
    this.insertWeightDataRequest.paramInfoId = this.requestDataWeight.indexGroup;
    this.insertWeightDataRequest.provinceId = this.requestDataWeight.provinceId;
    if (this.newArray.length > 0) {
      this.insertWeightDataRequest.listData = this.newArray;
      this.weightService
        .insertWeightData(this.insertWeightDataRequest)
        .subscribe(
          (res) => {
            this.isShowTable = false;
            this.isHaveWeight = true;
            this.isNewWeightThailand = false;
            this.weightId = res.weightId;
            //this.getWeightId();
            console.log('logResWeight', res);
            this.weight = res;
            this.checkOpenTab();
            this.checkDisableTab();
            this.saveSucessSwal.title = Message.MESSAGE_SAVE_SUCCESS;
            this.saveSucessSwal.show();
            console.log('insert');
            this.loading.hide();
          },
          (error) => {
            this.loading.hide();
          },
        );
    }
  }
}
