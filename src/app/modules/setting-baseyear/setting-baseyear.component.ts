import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BaseYearRequest } from 'src/app/shared/models/baseYear/baseYear';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-setting-baseyear',
  templateUrl: './setting-baseyear.component.html',
  styleUrls: ['./setting-baseyear.component.scss']
})
export class SettingBaseyearComponent implements OnInit {
  @ViewChild("msgError", { static: false }) msgError: SwalComponent;
  @ViewChild("msgWarning", { static: false }) msgWarning: SwalComponent;
  @ViewChild("msgSwl", { static: false }) msgSwl: SwalComponent;
  baseYear: number;
  startPeriodMonth: string = '01';
  startPeriodYear: number;
  endPeriodYear: number;
  endPeriodMonth: string = '12';
  filterBaseYearControl = new FormControl();
  filterBaseYearOptions: Observable<any[]>;
  checkMode = new Array();
  baseYearAll = new Array();
  month = [
    { id: '01', value: 'มกราคม' },
    { id: '02', value: 'กุมภาพันธ์' },
    { id: '03', value: 'มีนาคม' },
    { id: '04', value: 'เมษายน' },
    { id: '05', value: 'พฤษภาคม' },
    { id: '06', value: 'มิถุนายน' },
    { id: '07', value: 'กรกฎาคม' },
    { id: '08', value: 'สิงหาคม' },
    { id: '09', value: 'กันยายน' },
    { id: '10', value: 'ตุลาคม' },
    { id: '11', value: 'พฤศจิกายน' },
    { id: '12', value: 'ธันวาคม' }
  ]
  year = [];
  stepNo = null;
  constructor(
    private baseYearService: BaseyearService,
    private loading: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getAllBaseYear();
  }

  getAllBaseYear() {
    this.baseYearService.getAllBaseYear().subscribe(
      (res) => {
        console.log(res);
        this.baseYearAll = res;
        this.filterBaseYearOptions = this.filterBaseYearControl.valueChanges
          .pipe(
            startWith(''),
            map(value => {
              return value ? this._filterBaseYearList(value) : this.baseYearAll.slice();
            })
          );
      },
      (error) => { }
    )
  }

  private _filterBaseYearList(baseYear: number): any[] {
    const filterValue = baseYear.toString();
    this.checkMode = this.baseYearAll.filter(option =>
      option.baseYear.toString().startsWith(filterValue)
    )
    console.log(' this.checkMode', this.checkMode);
    if (this.checkMode.length === 0) {
      this.newBaseYear();
    }
    return this.checkMode;
  }

  newBaseYear() {
    this.startPeriodYear = null;
    this.startPeriodMonth = '01'
    this.endPeriodYear = null;
    this.endPeriodMonth = '12'
    this.stepNo = null;
  }

  onSave() {
    this.checkValidate();
  }

  checkValidate() {
    console.log("checkValidate", this.isEmpty(this.baseYear), this.baseYear);
    if (this.isEmpty(this.baseYear) || this.isEmpty(this.startPeriodMonth)
      || this.isEmpty(this.startPeriodYear) || this.isEmpty(this.endPeriodYear)
      || this.isEmpty(this.endPeriodMonth)) {
      this.msgWarning.title = "กรุณากรอกข้อมูลให้ครบ";
      this.msgWarning.show();
      return;
    } else if (this.startPeriodYear < this.baseYear || this.endPeriodYear < this.baseYear) {
      this.msgWarning.title = "กรุณาตรวจสอบปีเริ่มต้นและปีสิ้นสุด";
      this.msgWarning.show();
      return;
    } else if (this.startPeriodYear === this.endPeriodYear) {
      if (this.startPeriodMonth > this.endPeriodMonth) {
        this.msgWarning.title = "กรุณาตรวจสอบเดือนเริ่มต้นและเดือนสิ้นสุด";
        this.msgWarning.show();
        return;
      }
    } else if (this.startPeriodYear > this.endPeriodYear) {
      this.msgWarning.title = "กรุณาตรวจสอบปีเริ่มต้นและปีสิ้นสุด";
      this.msgWarning.show();
      return;
    }
    this.loading.show();
    let request = new BaseYearRequest();
    request.baseYear = this.baseYear;
    request.startPeriod = this.startPeriodYear + "|" + this.startPeriodMonth;
    request.endPeriod = this.endPeriodYear + "|" + this.endPeriodMonth;
    console.log(request);
    this.baseYearService.createBaseYear(request).subscribe(res => {
      this.loading.hide();
      this.msgSwl.title = "บันทึกข้อมูลสำเร็จ";
      this.msgSwl.show();
      this.clear();
    }, (error) => {
      this.loading.hide();
    })
  }

  isEmpty(data: any) {
    if (data === "" || data === null || data === undefined) {
      return true;
    }
    return false;
  }

  clear() {
    this.baseYear = null;
    this.startPeriodMonth = '01';
    this.startPeriodYear = null;
    this.endPeriodYear = null;
    this.endPeriodMonth = '12';
    this.getAllBaseYear();
  }

  selectIndexGroup(e) {
    if (e && e.option && e.option.value) {
      let objBaseYear = e.option.value;
      console.log(objBaseYear);
      let startPeriod: string = objBaseYear ? objBaseYear.startPeriod : "";
      let endPeriod: string = objBaseYear ? objBaseYear.endPeriod : "";
      let startYear = startPeriod ? startPeriod.substr(0, 4) : null;
      let startMonth = startPeriod ? startPeriod.substr(5, 4) : '01';
      let endYear = endPeriod ? endPeriod.substr(0, 4) : null;
      let endMonth = endPeriod ? endPeriod.substr(5, 4) : '12';
      this.startPeriodYear = startYear ? Number(startYear) : null;
      this.startPeriodMonth = startMonth;
      this.endPeriodYear = endYear ? Number(endYear) : null;
      this.endPeriodMonth = endMonth;
      this.stepNo = 0;
    }
  }


  displayBaseYear(baseYear: any) {
    return baseYear ? baseYear.baseYear : '';
  }

}
