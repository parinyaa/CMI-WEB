import {Component, OnInit, ViewChild} from '@angular/core';
import {ProvinceService} from 'src/app/core/service/province/province.service';
import {SessionServiceService} from 'src/app/core/service/common/session-service.service';
import {PkgMigrateService} from 'src/app/core/service/pkgmigrate/pkg-migrate.service';
import {migrateDataRequest} from 'src/app/shared/models/pkgmigrate/migrateDataRequest';
import Swal from 'sweetalert2';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {NgxSpinnerService} from 'ngx-spinner';
import {element} from 'protractor';
import {PriceDataRequestForm} from './../../shared/models/dataenty/request/PriceDataRequestForm';
import {DataEntyService} from '../../core/service/dataenty/dataenty.service';
import * as FileSaver from 'file-saver';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {ProvinceResponse} from 'src/app/shared/models/responses/provinceResponse';
import {RegionResponse} from 'src/app/shared/models/responses/regionResponse';
import {Router} from '@angular/router';
import {PricedataService} from 'src/app/core/service/pricedata/pricedata.service';

@Component({
  selector: 'app-migrate-price-data',
  templateUrl: './migrate-price-data.component.html',
  styleUrls: ['./migrate-price-data.component.scss'],
})
export class MigratePriceDataComponent implements OnInit {
  userProfile;
  provinceRes: Array<ProvinceResponse>;
  listProvince: Array<ProvinceResponse> = [];
  checkProvinceId = false;
  // yearData; //ของเก่า
  yearData = 2560;
  monthData;
  checkMonthValue;
  // nameMonth;//ของเก่า
  nameMonth = 1;
  messageResponse;
  messageConfirm;
  dataMonth;
  myDate: Date;
  filterProvinceOptions: Observable<any[]>;
  filterProvinceControl = new FormControl();
  year = new Array();
  month = [
    {
      name: 'มกราคม ',
      value: 1,
    },
    {
      name: 'กุมภาพันธ์ ',
      value: 2,
    },
    {
      name: 'มีนาคม ',
      value: 3,
    },
    {
      name: 'เมษายน ',
      value: 4,
    },
    {
      name: 'พฤษภาคม ',
      value: 5,
    },
    {
      name: 'มิถุนายน ',
      value: 6,
    },
    {
      name: 'กรกฎาคม ',
      value: 7,
    },
    {
      name: 'สิงหาคม ',
      value: 8,
    },
    {
      name: 'กันยายน ',
      value: 9,
    },
    {
      name: 'ตุลาคม ',
      value: 10,
    },
    {
      name: 'พฤศจิกายน ',
      value: 11,
    },
    {
      name: 'ธันวาคม ',
      value: 12,
    },
  ];
  constructor(
    private provinceService: ProvinceService,
    private sessionService: SessionServiceService,
    private pkgMigrateService: PkgMigrateService,
    private loading: NgxSpinnerService,
    private dataEntyService: DataEntyService,
    private route: Router,
    private pricedataService: PricedataService,
  ) {}

  ngOnInit() {
    this.getYearTermList();
    this.setSelectProvince();
    this.getYearMonth();
  }

  getYearTermList() {
    this.loading.show();
    this.pricedataService.getYearTermList().subscribe(
      (res) => {
        this.loading.hide();
        console.log(res);
        if(res.length > 0) {
          res.map( x => {
            const obj = {'year': x , 'value' : x};
            this.year.push(obj);
          })
        }
       
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  private _filterProvinceList(province: string): any[] {
    const filterValue = province;
    let selectProvince: any;

    selectProvince = this.listProvince.filter(
      (option) =>
        option.provinceCode.toString().startsWith(filterValue) ||
        option.provinceName.toString().startsWith(filterValue),
    );

    return selectProvince;
  }

  displayFilterProvince(province?: ProvinceResponse): string | undefined {
    console.log('displayFilterProvince === ', province);

    return province
      ? province.provinceCode + ' ' + province.provinceName
      : undefined;
  }

  getUserProfile() {
    this.userProfile = this.sessionService.getUserProfile();
    if (this.userProfile.provinceId !== null) {
      console.log(this.userProfile.localFirstName);

      this.filterProvinceControl.setValue(
        this._filterProvinceList(this.userProfile.localFirstName)[0],
      );
      console.log(
        'filterProvinceControl === ',
        this.filterProvinceControl.value,
      );
      this.checkProvinceId = true;
      this.filterProvinceControl.disable();
    } else {
      // this.filterProvinceControl.setValue(this._filterProvinceList('ทั้งหมด'));
      this.filterProvinceControl.setValue(
        this.listProvince.find((x) => x.provinceName === 'กรุงเทพมหานคร'),
      );
    }
  }

  setSelectProvince() {
    this.provinceService.getProvinceAll().subscribe(
      (res) => {
        this.listProvince = res;
        let province = new ProvinceResponse();
        let region = new RegionResponse();
        region.regionCode = '0';
        region.regionId = 0;
        region.regionName = 'ทั้งหมด';
        region.regionNameEn = 'ทั้งหมด';
        province.provinceCode = 0;
        province.provinceId = 0;
        province.provinceName = 'ทั้งหมด';
        province.cpipMsRegion = region;
        this.listProvince.push(province);

        this.filterProvinceOptions = this.filterProvinceControl.valueChanges.pipe(
          startWith(''),
          map((value) => {
            console.log(value);

            return value
              ? this._filterProvinceList(value)
              : this.listProvince.slice();
          }),
        );
        this.getUserProfile();
      },
      (error) => {},
    );
  }

  getYearMonth() {
    this.pkgMigrateService.getYearMonth().subscribe(
      (res) => {
        // this.yearData = res.year; //ของเก่า
        this.monthData = res.month;
        console.log('res yearData', this.yearData);
        console.log('res monthData', this.monthData);
        this.checkMonthValue = this.month.find(
          (x) => x.value === this.monthData,
        );
        // this.nameMonth = this.checkMonthValue.name; //ของเก่า
        this.nameMonth = this.monthData;
        this.yearData = res.year;
        // this.myDate = new Date();
        let year = this.year.find(
          (x) =>
            x.value ===
            (this.yearData < 2560 ? this.yearData + 543 : this.yearData),
        ).value;
        console.log('year ==== ', year);
        this.yearData = year;
      },
      (error) => {},
    );
  }

  async onSave() {
    this.loading.show();
    const request = new migrateDataRequest();
    // request.month = this.monthData; //ของเก่า
    request.month = this.nameMonth;
    request.province = this.filterProvinceControl.value.provinceId;
    // request.year = this.yearData; //ของเก่า
    request.year = this.yearData;
    console.log('res month', request.month);
    console.log('res year', request.year);
    console.log('res province', request.province);
    this.pkgMigrateService.migrateData(request).subscribe(
      async (res) => {
        console.log('res', res);
        console.log('resmess', res.message);
        this.messageResponse = res.message;
        // this.swalMessageConfirmMigrate()
        if (res.code === 'SUCCESS' || res.code === 'E003') {
          this.swalMessageConfirmMigrateSucces();
        } else if (res.code === 'E002') {
          this.swalMessageMigrateSucces();
        } else if (res.code === 'E006') {
          this.swalMessageExportValidateExcel();
        } else {
          this.swalMessageMigrateError();
        }
        // if (res.code === 'E001') {
        //   this.swalMessageMigrateError();
        // } else if (res.code === 'E002') {
        //   this.swalMessageMigrate();
        // } else if (res.code === 'SUCCESS' || res.code === 'E003') {
        //   this.swalMessageMigrateSucces();
        // } else {
        //   this.swalMessageMigrateError();
        // }
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  swalMessageMigrate() {
    Swal.fire({
      type: 'question',
      title: this.messageResponse,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
      width: 700,
    }).then((result) => {
      this.loading.show();
      console.log('result', result);
      if (result.value === true) {
        //กดใช่
        const request = new migrateDataRequest();
        // request.month = this.monthData;  //ของเก่า
        request.month = this.nameMonth;
        request.province = this.filterProvinceControl.value.provinceId;
        // request.year = this.yearData; //ของเก่า
        request.year = this.yearData;
        console.log('res confirm month', request.month);
        console.log('res confirm year', request.year);
        console.log('res confirm province', request.province);
        this.pkgMigrateService.confirmMigrate(request).subscribe(
          (res) => {
            this.loading.hide();
            console.log('confirm confirm', res);
            this.messageConfirm = res.message;
            if (res.code === 'E003') {
              this.swalMessageConfirmMigrateSucces();
            } else if (res.code === 'E004') {
              this.swalMessageConfirmMigrateError();
            }
          },
          (error) => {
            this.loading.hide();
          },
        );
      } else {
        this.loading.hide();
      }
    });
  }

  swalMessageMigrateError() {
    Swal.fire({
      type: 'error',
      title: this.messageResponse,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
      width: 1000,
    }).then((result) => {
      console.log('result', result);
    });
  }

  swalMessageMigrateSucces() {
    Swal.fire({
      type: 'info',
      title: 'ต้องการดึงข้อมูลอีกครั้งหรือไม่ ?',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
      showCancelButton: true,
    }).then((result) => {
      const request = new migrateDataRequest();
      // request.month = this.monthData;  //ของเก่า
      request.month = this.nameMonth;
      request.province = this.filterProvinceControl.value.provinceId;
      // request.year = this.yearData; //ของเก่า
      request.year = this.yearData;
      if (result.value === true) {
        this.loading.show();
        this.pkgMigrateService.confirmMigrate(request).subscribe(
          (res) => {
            this.loading.hide();
            console.log('res', res);
            console.log('resmess', res.message);
            this.messageResponse = res.message;
            if (res.code === 'E006') {
              this.swalMessageExportValidateExcel();
            } else if (res.code === 'SUCCESS' || res.code === 'E003') {
              this.messageConfirm = res.message;
              this.swalMessageConfirmMigrateSucces();
            } else {
              this.swalMessageMigrateError();
            }
          },
          (error) => {
            this.loading.hide();
            console.log(new Blob([error.error.text]));
          },
        );
      }
      console.log('result', result);
      // this.loading.hide();
    });
  }

  swalMessageConfirmMigrateSucces() {
    Swal.fire({
      type: 'info',
      title:
        this.messageConfirm && this.messageConfirm != ''
          ? this.messageConfirm
          : 'ดึงข้อมูลราคาสำเร็จ',
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      console.log('result', result);
      if (result) {
        const object = {
          provinceId: this.filterProvinceControl.value
            ? this.filterProvinceControl.value.provinceId
            : null,
        };
        this.sessionService.setKeyMigratePrice(object);
        this.route.navigateByUrl('/dataenty');
      }
    });
  }

  swalMessageConfirmMigrateError() {
    Swal.fire({
      type: 'error',
      title: this.messageConfirm,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      console.log('result', result);
    });
  }

  swalMessageExportValidateExcel() {
    console.log(
      this.nameMonth +
        ' ' +
        this.filterProvinceControl.value.provinceId +
        ' ' +
        this.yearData,
    );
    Swal.fire({
      type: 'success',
      title: this.messageResponse,
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      this.loading.show();
      let request = new PriceDataRequestForm();
      request.monthTerm = this.nameMonth;
      request.provinceId = this.filterProvinceControl.value.provinceId;
      request.yearTerm = this.yearData;
      console.log('request');
      console.log('month', request.monthTerm);
      console.log('year', request.yearTerm);
      console.log('province', request.provinceId);
      this.dataEntyService.exportValidatePriceDataReport(request).subscribe(
        (res) => {
          this.loading.hide();
          // console.log(res);
          const file = new Blob([res], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const url = window.URL.createObjectURL(file);
          // window.open(url);
          let province =
            request.provinceId === 0
              ? 'ทุกจังหวัด'
              : this.listProvince.find(
                  (x) => x.provinceId === request.provinceId,
                ).provinceName;
          let month = this.month.find((x) => x.value === request.monthTerm)
            .name;
          let year = this.year.find((x) => x.value === request.yearTerm).year;
          FileSaver.saveAs(
            res,
            'รายงานตรวจสอบข้อมูลราคาสินค้า_' +
              province +
              '_' +
              month +
              '_' +
              year +
              '.xlsx',
          );
        },
        (error) => {
          this.loading.hide();
          console.log(new Blob([error.error.text]));
        },
      );
    });
  }
}
