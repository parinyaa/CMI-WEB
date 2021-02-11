import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { isNull } from 'util';
import { InsertWeightDataRequest } from 'src/app/shared/models/weight/request/InsertWeightDataRequest';
type AOA = any[][];
import * as XLSX from 'xlsx';
import { ParamService } from 'src/app/core/service/param/param.service';

@Component({
  selector: 'app-weight-page',
  templateUrl: './weight-page.component.html',
  styleUrls: ['./weight-page.component.scss']
})
export class WeightPageComponent implements OnInit {

  @ViewChild('typeFileSwal', { static: false }) typeFileSwal: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  @ViewChild('deleteWeightSuccess', { static: false }) deleteWeightSuccess: SwalComponent;

  afuConfig = {
    uploadAPI: {
      url: "https://example-file-upload-api"
    },
    formatsAllowed: ".csv,.xlsx",
    maxSize: "20",
    hideResetBtn: true,
    theme: "dragNDrop",
    replaceTexts: {
      selectFileBtn: 'เลือกไฟล์',
      resetBtn: 'ยกเลิก',
      uploadBtn: 'อัพโหลด',
      dragNDropBox: 'Drag and Drop',
      afterUploadMsg_success: 'อัพโหลดเสร็จสิ้น',
      afterUploadMsg_error: 'อัพโหลดผิดพลาด!'
    }
  };
  data: any;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  disableTab2 = false;
  disableTab3 = false;
  disableTab4 = false;
  baseYearList;
  noBaseYear = false;
  isHaveWeight = false;
  isNewWeight = false;
  baseYear;
  newArray = new Array();
  currentWeight: any;
  TabStep = 1;
  weight;
  paramList = new Array();
  selectedIndex: any;
  fileName: string = 'SheetJS.xlsx';
  isShowButton = false;

  constructor(
    private loading: NgxSpinnerService,
    private weightService: WeightService,
    private insertWeightDataRequest: InsertWeightDataRequest,
    private paramService: ParamService,
  ) { }

  ngOnInit() {
    this.loading.show();
    this.getBaseYear();
    this.getParam();
  }

  getBaseYear() {
    this.weightService.getBaseYear().subscribe(res => {
      this.loading.hide();
      if (res.length) {
        this.baseYearList = res;
      }
      else {
        this.noBaseYear = true;
      }
    },
      (error) => {
        this.loading.hide();
      });
  }

  getWeightByBaseYearAndStatus() {
    this.loading.show();
    this.weightService.getWeightByBaseYearAndStatus(this.baseYear.baseYearId, this.baseYear.status).subscribe((res) => {
      this.isShowButton = false;
      this.isHaveWeight = false;
      this.isNewWeight = false;
      if (isNull(res)) {
        if (this.baseYear.status == 'NEW') {
          this.isNewWeight = true;
        }
        else if (this.baseYear.status == 'ACTIVE') {
          this.warningSwal.title = "ไม่ได้จัดเก็บข้อมูลปีฐาน";
          this.warningSwal.show();
        }
      }
      else {
        this.weight = res;
        if (this.weight.stepNo < 4.1) {
          this.isShowButton = true;
        }
        this.checkDisableTab(res.stepNo);
        this.isHaveWeight = true;
      }
      this.loading.hide();
    },
      (error) => {
        console.log(error)
        this.loading.hide();
      });
  }

  selectBaseYear(event) {
    this.baseYear = event.value;
    this.getWeightByBaseYearAndStatus();
  }

  drop(event) {
    event.preventDefault();
    let type = event.dataTransfer.files[0].type;
    if (type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.onDropLoadFile(event);
    } else {
      this.typeFileSwal.show();
    }
  }

  onDropLoadFile(evt: any) {
    this.loading.show();
    this.newArray = [];
    var file = evt.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let data = Object.values(this.data);
      console.log('file', data);
      let sumWeight = 0;
      Object.keys(data).forEach((key, index) => {
        if (index != 0) {
          if (!isNull(data[key][1]) && !isNull(data[key][2]) && !isNull(data[key][3])) {
            this.newArray.push({
              'weightCode': data[key][0],
              'weightSubCode': data[key][1],
              'description': data[key][2],
              'weight': parseFloat(this.financial(data[key][3]))
            })
            let weightCode: string = data[key][0];
            if (weightCode !== undefined) {
              if (/\S/.test(weightCode)) {
                sumWeight += parseFloat(this.financial(data[key][3]));
              }
            }
          }
        }
      })
      if (this.newArray.length > 0) {
        if (this.isNewWeight) {
          this.insertWeightDataRequest.listData = this.newArray;
          this.insertWeightDataRequest.baseYearId = this.baseYear.baseYearId;
          this.insertWeightDataRequest.sumWeight = sumWeight;
          this.weightService.insertWeightData(this.insertWeightDataRequest).subscribe(res => {
            this.loading.hide();
            this.getWeightByBaseYearAndStatus();
          },
            (error) => {
              this.loading.hide();
            });
        }
      }
    };
    reader.readAsBinaryString(file);
  }

  financial(n) {
    return Number.parseFloat(n).toFixed(5);
  }

  allowDrop(evt: DragEvent) {
    evt.preventDefault();
  }

  deleteWeight() {
    this.loading.show();
    this.weightService.deleteWeight(this.weight.weightId).subscribe((res) => {
      this.loading.hide();
      this.deleteWeightSuccess.show();
    },
      (error) => {
        console.log(error);
        this.loading.hide();
      });
  }

  refresh() {
    window.location.reload();
  }

  onTabClick(event) {
    if (event.index == 0) {
      this.TabStep = 1;
    }
    else if (event.index == 1) {
      this.TabStep = 2;
    }
    else if (event.index == 2) {
      this.TabStep = 3;
    }
    else if (event.index == 3) {
      this.TabStep = 4;
    }
  }

  checkDisableTab(step: number) {
    if (step == 1.1 || step == 1.2) {
      this.disableTab2 = true;
      this.disableTab3 = true;
      this.disableTab4 = true;
    }
    else if (step == 2.1) {
      this.disableTab2 = false;
      this.disableTab3 = true;
      this.disableTab4 = true;
    }
    else if (step == 3.1 || step == 3.2) {
      this.disableTab2 = false;
      this.disableTab3 = false;
      this.disableTab4 = true;
    }
    else if (step == 4.0) {
      this.disableTab2 = false;
      this.disableTab3 = false;
      this.disableTab4 = false;
    }
    this.checkOpenTab();
  }

  getParam() {
    this.paramService.getParamsGroup().subscribe((res) => {
      res.forEach(element => {
        if (element.paramGroup == 'WEIGHT_ACTION') {
          this.paramList = element.info;
        }
      });
    });
  }

  onFileChange(evt: any) {
    this.loading.show();
    this.newArray = [];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      this.loading.hide();
      return;
    };
    this.fileName = target.files.item(0).name;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      let data = Object.values(this.data);
      console.log('file', data);
      let sumWeight = 0;
      Object.keys(data).forEach((key, index) => {
        if (index != 0) {
          if (!isNull(data[key][1]) && !isNull(data[key][2]) && !isNull(data[key][3])) {
            this.newArray.push({
              'weightCode': data[key][0],
              'weightSubCode': data[key][1],
              'description': data[key][2],
              'weight': parseFloat(this.financial(data[key][3]))
            })
            let weightCode: string = data[key][0];
            if (weightCode !== undefined) {
              if (/\S/.test(weightCode)) {
                sumWeight += parseFloat(this.financial(data[key][3]));
              }
            }
          }
        }
      })
      if (this.newArray.length > 0) {
        if (this.isNewWeight) {
          this.insertWeightDataRequest.listData = this.newArray;
          this.insertWeightDataRequest.baseYearId = this.baseYear.baseYearId;
          this.insertWeightDataRequest.sumWeight = sumWeight;
          this.weightService.insertWeightData(this.insertWeightDataRequest).subscribe(res => {
            this.loading.hide();
            this.getWeightByBaseYearAndStatus();
          },
            (error) => {
              this.loading.hide();
            });
        }
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  updateWeight(event) {
    this.weight = event;
  }

  checkOpenTab() {
    if (this.weight.stepNo == 1.2 || this.weight.stepNo == 1.1) {
      this.selectedIndex = 0;
      this.TabStep = 1;
    }
    else if (this.weight.stepNo == 2.1) {
      this.selectedIndex = 1;
      this.TabStep = 2;
    }
    else if (this.weight.stepNo == 3.1 || this.weight.stepNo == 3.2) {
      this.selectedIndex = 2;
      this.TabStep = 3;
    }
    else if (this.weight.stepNo >= 4.0) {
      this.selectedIndex = 3;
      this.TabStep = 4;
    }
  }

}
