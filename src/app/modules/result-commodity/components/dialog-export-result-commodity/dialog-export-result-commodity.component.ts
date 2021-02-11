import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { CommodityService } from 'src/app/core/service/commodity/commodity.service';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { PkgMigrateService } from 'src/app/core/service/pkgmigrate/pkg-migrate.service';
import { ProvinceService } from 'src/app/core/service/province/province.service';
import { RegionService } from 'src/app/core/service/region/region.service';
import { Category } from 'src/app/modules/commodity-validate/models/category';
import { InspectParameter } from 'src/app/modules/commodity-validate/models/inspect-parameter';
import { PPIMSRegion, Province } from 'src/app/modules/keyin-data/model/neighborhoodResponse';
import { CheckMonthYearRequest, DataToDialogExportResultCommodity, ExportResultCommodityRequest } from 'src/app/shared/models/result-commodity/request/InquiryResultCommodityRequest.model';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialog-export-result-commodity',
  templateUrl: './dialog-export-result-commodity.component.html',
  styleUrls: ['./dialog-export-result-commodity.component.scss']
})
export class DialogExportResultCommodityComponent implements OnInit {

  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;

  fromData: FormGroup;
  regionList = new Array();
  noDataRegion: boolean = false;
  filterProvinceOptions: Observable<Province[]>;
  provinceList = new Array<Province>();
  yearList = new Array();
  monthList = new Array();
  submitted = false;
  userProfile: any;
  baseYearList = new Array();
  categoryList: Category[];
  currentType: any;
  validateMonthYearRes: string;
  checkRegion: boolean = false;
  disabledProvince: boolean = false;
  dataCurrent = new DataToDialogExportResultCommodity();
  checkOpenDialogFirst: boolean = true;
  provinceMsList = new Array<Province>();

  constructor(
    public dialogRef: MatDialogRef<DialogExportResultCommodityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private regionService: RegionService,
    private commodityService: CommodityService,
    private pkgMigrateService: PkgMigrateService,
    private loading: NgxSpinnerService,
    private provinceService: ProvinceService,
    private sessionService: SessionServiceService,
    private baseyearService: BaseyearService,
    private paramService: ParamService,
    private datePipe: DatePipe
  ) { 
    this.dataCurrent = this.data.dataCerrentFrom;

  }

  ngOnInit() {
    console.log('data=== ',this.dataCurrent);
    this.userProfile = this.sessionService.getUserProfile();
    this.fromData = this._FormBuild.group({
      region:  [''],
      province:[''],
      baseYear: ['', Validators.required],
      startYear: ['', Validators.required],
      startMonth: ['', Validators.required],
      endYear: ['', Validators.required],
      endMonth: ['', Validators.required],
      groupCpip: [''],
      commodityCode: [''],
    });
    this.fromData.controls['commodityCode'].setValue(this.dataCurrent.commodityCode);
    this.getAllProvince();
    this.getBaseYearActive();
    this.getCategory();
   
  }

  onSubmit() {
    this.submitted = true;
    if (this.fromData.invalid) {
      this.validateRegionProvice();
      return;
    } else {
      this.validateRegionProvice();
    }
  }

  get f() {
    return this.fromData.controls;
  }

  getRegion() {
    this.loading.show();
    this.regionService.getRegion()
      .subscribe(
        (res) => {
          console.log(res);
          this.regionList = res;
          if (this.regionList.length == 0) { this.noDataRegion = true; }
          
          if (this.userProfile.userTypeCode === 'PROVINCE_USER') {

            if(this.fromData.controls['province'].value.provinceId !== 0) {
              let region = this.regionList.find((x) => x.cpipMsRegion.regionId === this.fromData.controls['province'].value.cpipMsRegion.regionId);
              this.fromData.controls['region'].setValue(region ? region.cpipMsRegion : 0);

            }

             console.log('regionnnnnnn = ', this.fromData.controls['region'].value);
             
          } else {
            if(this.fromData.controls['province'].value !== 0 && this.fromData.controls['province'].value.provinceId !== 0) {
                 
            let region = this.regionList.find((x) => x.cpipMsRegion.regionId === this.fromData.controls['province'].value.cpipMsRegion.regionId);
            this.fromData.controls['region'].setValue(region ? region.cpipMsRegion : 0);
            }
            else if(!this.fromData.controls['region'].value) {
              this.fromData.controls['region'].setValue(0);
            }

            console.log('regionnnnnnn = ', this.fromData.controls['region'].value);

          }
          this.loading.hide();
        },
        (error) => {
          this.regionList = [];
          this.loading.hide();
          this.noDataRegion = true;
        }
      )
  }
 
  selectionChangeProvice(event) {

    if(event) {
      console.log('selectionChangeProvice = ',event);
      let region0 = new PPIMSRegion();
      region0.regionCode = '';
      region0.regionId = 0;
      region0.regionName= 'ทั้งหมด';

      let provice0 = new Province();
      provice0.provinceId =  0 ;
      provice0.provinceName = 'ทั้งหมด';
      provice0.provinceCode = '';
      provice0.cpipMsRegion = region0;


      if(event.provinceId !== 0) {
            
      let region = this.regionList.find((x) => x.cpipMsRegion.regionId === this.fromData.controls['province'].value.cpipMsRegion.regionId );
      this.fromData.controls['region'].setValue(region ? region.cpipMsRegion : 0);
      
      this.checkRegion = false;
      this.provinceList =  new Array<Province>();
        
      
        let provinceList = this.provinceMsList.filter((option) =>
        option.cpipMsRegion.regionId.toString().startsWith(event.cpipMsRegion.regionId.toString()),
        );

        console.log('provinceList = ',provinceList);
        

        this.provinceList.push(provice0);
        provinceList.forEach(element => {
          this.provinceList.push(element);
        });

        console.log('provinceListsss = ',this.provinceList);
        
      } 
    }
  }

selectRegion(event) {
this.provinceList = new Array<Province>();
console.log('eventRegion = ',event.value);
console.log('regionFromData = ',this.fromData.controls['region'].value);

if((this.fromData.controls['region'].value === '' || this.fromData.controls['region'].value === 0) &&
(this.fromData.controls['province'].value === '' || this.fromData.controls['province'].value === 0)
){
this.checkRegion = true;
} else {

  this.checkRegion = false;

}
console.log('kuyyyyy ',event);

if(event.value !== 0) {
  
  this.getProvinceByRegion(event.value.regionId);
} else {
  this.getAllProvince();
}
}  

  selectBaseYear(event) {

    this.getListYearFromPriceData(event.baseYearId);
    this.getParamMonth();
  }

  getListYearFromPriceData(id) {
    this.commodityService.inquiryYearFromPriceDataById(id).subscribe((res) => {
      this.yearList = res;

      // this.getYearMonth();
    });
  }

  getYearMonth() {
    this.pkgMigrateService.getYearMonth().subscribe(
      (res) => {
        let resMonth = String(res.month);
        let month = this.monthList.find((x) => x.paramInfo === resMonth);
        console.log('month ==== ',month);
        this.fromData.controls['startMonth'].setValue(month.paramInfo);
        let year = this.yearList.find((x) => x === (res.year < 2560 ? res.year +543:res.year));
          console.log('year ==== ',year);
          this.fromData.controls['startYear'].setValue(year);
      },
      (error) => { },
    );
  }

  getAllProvince() {
    this.loading.show();
    this.provinceService.getAllProvince().subscribe(
      (res) => {
        this.provinceList =  new Array<Province>();
        this.provinceMsList =  new Array<Province>();
        this.loading.hide();
        let region0 = new PPIMSRegion();
        region0.regionCode = '';
        region0.regionId = 0;
        region0.regionName= 'ทั้งหมด';

        let provice0 = new Province();
        provice0.provinceId =  0 ;
        provice0.provinceName = 'ทั้งหมด';
        provice0.provinceCode = '';
        provice0.cpipMsRegion = region0;

        this.provinceList.push(provice0);
        res.forEach(element => {
          this.provinceList.push(element);
        });

        this.provinceMsList.push(provice0);
        res.forEach(element => {
          this.provinceMsList.push(element);
        });


          if (this.userProfile.userTypeCode === 'PROVINCE_USER') {
            this.disabledProvince = true;
          console.log('userProfile.provinceId', this.userProfile.provinceId);
          let province = this.provinceList.find(
            (x) => x.provinceId === this.userProfile.provinceId,
          );
          this.fromData.controls['province'].setValue(province ? province : 0);
        } else {
          this.disabledProvince = false;
          let province

          if(this.checkOpenDialogFirst)  {
              this.checkOpenDialogFirst = false;
            province = this.provinceList.find(
              (x) => x.provinceId === this.dataCurrent.provinceId,
            );
            this.fromData.controls['province'].setValue(province ? province : 0);

          } else{
            province = this.provinceList.find(
              (x) => x.provinceId === this.fromData.controls['province'].value.provinceId,
            );
            this.fromData.controls['province'].setValue(province ? province : 0);
          }
          console.log('ssssss =',this.fromData.controls['province'].value);
          

          
      if(this.fromData.controls['province'].value !== 0 && this.fromData.controls['province'].value.provinceId !== 0 && this.fromData.controls['region'].value !== 0) {
        
      
        this.getProvinceByRegion(this.fromData.controls['province'].value.cpipMsRegion.regionId);
      } 

          
        }

       if(this.fromData.controls['region'].value !== 0) {
          this.getRegion();
        }



        this.filterProvinceOptions = this.fromData.controls['province'].valueChanges.pipe(
          startWith(''),
          map((value) => {
            console.log(value);
            return typeof value === 'string' ? value : value.provinceName;
          }),
          map((provinceName) => {
            console.log(provinceName);
            return provinceName
              ? this._filterProvinceList(provinceName)
              : this.provinceList.slice();
          }),
        );
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  getProvinceByRegion(regionId) {
    this.loading.show();
    this.regionService.getProvince(regionId).subscribe(
      (res) => {
        this.provinceList =  new Array<Province>();
        this.loading.hide();
        let region0 = new PPIMSRegion();
        region0.regionCode = '';
        region0.regionId = 0;
        region0.regionName= 'ทั้งหมด';

        let provice0 = new Province();
        provice0.provinceId =  0 ;
        provice0.provinceName = 'ทั้งหมด';
        provice0.provinceCode = '';
        provice0.cpipMsRegion = region0;

        this.provinceList.push(provice0);
        res.forEach(element => {
          this.provinceList.push(element);
        });

        console.log(this.provinceList);
        if (this.userProfile.userTypeCode !== 'PROVINCE_USER') {

          let provinceGetOne = this.fromData.controls['province'].value &&
          this.provinceList.find((x => x.provinceId === this.fromData.controls['province'].value.provinceId))
          ? this.provinceList.find((x => x.provinceId === this.fromData.controls['province'].value.provinceId)) : 0;
          this.fromData.controls['province'].setValue(provinceGetOne ? provinceGetOne 
            :this.provinceList.find((x => x.provinceId === 0)));
  
      }

        this.filterProvinceOptions = this.fromData.controls['province'].valueChanges.pipe(
          startWith(''),
          map((value) => {
            console.log(value);
            return typeof value === 'string' ? value : value.provinceName;
          }),
          map((provinceName) => {
            console.log(provinceName);
            return provinceName
              ? this._filterProvinceList(provinceName)
              : this.provinceList.slice();
          }),
        );
      },
      (error) => {
        this.loading.hide();
      },
    );
  }

  private _filterProvinceList(name: string): Province[] {
    const filterValue = name;

    return this.provinceList.filter((option) =>
    option.provinceCode.startsWith(filterValue) || option.provinceName.startsWith(filterValue),
    );
  }

  displayFilterProvince(province?: Province): string | undefined {
    return province ?  province.provinceCode + ' ' +  province.provinceName: undefined;
  }

  getBaseYearActive() {
    this.baseyearService.getActiveBaseYear().subscribe((res) => {
      this.baseYearList = res;
      let baseYearCurrent = this.baseYearList.find(
        (x) => x.baseYearId === this.dataCurrent.baseYearId,
      );
      this.fromData.controls['baseYear'].setValue(baseYearCurrent ? baseYearCurrent : '');

      if(this.fromData.controls['baseYear'].value !== '') {
        this.selectBaseYear(this.fromData.controls['baseYear'].value)
      }

    });
  }

  getParamMonth() {
      this.monthList = this.paramService.getParamByGroup('MONTH');
      console.log('MONTHLIST === ',this.monthList);

      this.monthList = this.monthList.sort((a, b) => a.orderNo - b.orderNo);
  }

  getCategory() {
    this.commodityService.getCategory().subscribe((res: Category[]) => {
      console.log('log getCategory', res);
      this.categoryList = res;
      const type = this.categoryList.length > 0 ? this.categoryList[0] : null;
      console.log('typeeee', type);
      this.currentType = type;
      const inboxParam: InspectParameter = this.sessionService.getInspectParam();
    });
    this.fromData.controls['groupCpip'].setValue('0')
  }


  exportResultCommodity() {
    console.log('------export-----');

    let request = new ExportResultCommodityRequest();
    let date = new Date()
    let fromatDate = this.datePipe.transform(date,"yyyyMMdd");
    let fromartTime = this.datePipe.transform(new Date(),"HHmmss");
    console.log('fromartTime == ',fromartTime);

    request.regionId = this.fromData.controls['region'].value ? this.fromData.controls['region'].value.regionId : 0;
    request.provinceId = this.fromData.controls['province'].value ? this.fromData.controls['province'].value.provinceId : 0;
    request.baseYearId = this.fromData.controls['baseYear'].value.baseYearId;
    request.startYear = this.fromData.controls['startYear'].value;
    request.startMonth = Number(this.fromData.controls['startMonth'].value);
    request.endYear = this.fromData.controls['endYear'].value;
    request.endMonth = Number(this.fromData.controls['endMonth'].value);
    request.groupCpip = this.fromData.controls['groupCpip'].value.commodityCode ? this.fromData.controls['groupCpip'].value.commodityCode : '0';
    request.commodityCode = this.fromData.controls['commodityCode'].value ? this.fromData.controls['commodityCode'].value: '0';
    request.type = this.dataCurrent.type;
    request.fileName = this.dataCurrent.title +'_' + fromatDate +'_'+fromartTime;

    let fileName:string;
      fileName = this.dataCurrent.title;
     
        
    this.commodityService
      .exportIncludeCommodity(request)
      .subscribe(
        (res) => {
          let mediaType = 'application/octet-stream';
          const blob = new Blob([res], { type: mediaType });
          console.log('blob', blob);
          FileSaver.saveAs(
            blob,
            fileName  +'_' + fromatDate +'_'+fromartTime + '.xlsx',
          );
          this.loading.hide();
        },
        (error) => {
          this.loading.hide();
          console.log(error);
        },
      );
  }
  validateRegionProvice(){
    console.log('ressssssssss ==== ',this.fromData.controls['province'].value);
    if((this.fromData.controls['region'].value === '' || this.fromData.controls['region'].value === 0) &&
       (this.fromData.controls['province'].value === '' || this.fromData.controls['province'].value === 0
        || this.fromData.controls['province'].value.provinceId === 0)
     ){
      this.checkRegion = true;
    } else {
      this.checkRegion = false;
      this.validateMonth();
    }
  }
  validateMonth(){
    this.loading.show();
    let request = new CheckMonthYearRequest();
    
    request.startYear =  this.fromData.controls['startYear'].value;
    request.startMonth =  Number(this.fromData.controls['startMonth'].value);
    request.endYear =  this.fromData.controls['endYear'].value;
    request.endMonth =  Number(this.fromData.controls['endMonth'].value);

    if(!this.checkRegion && this.fromData.controls['startYear'].value !== ''
       && this.fromData.controls['startMonth'].value !== '' 
       && this.fromData.controls['endYear'].value !== ''
       && this.fromData.controls['endMonth'].value !== '') {

      this.commodityService.validateMonthYear(request)
      .subscribe(
        (res) => {
          this.validateMonthYearRes = res.result;
          console.log('this.validateMonthYearRes ==== ',res);
          if(this.validateMonthYearRes !== 'VALID') {
            this.loading.hide();
            this.warningSwal.title = this.validateMonthYearRes;
            this.warningSwal.show();
            return
            

          } else {
            this.exportResultCommodity();
          }
        },
        (error) => {
          this.loading.hide();
        }
      )
    } else {
      this.loading.hide();
    }
  }
}
