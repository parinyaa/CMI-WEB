import { SessionServiceService } from './../../../core/service/common/session-service.service';
import { Location } from '@angular/common';
import { DialogEditprovinceComponent } from './components/dialog-editprovince/dialog-editprovince.component';
import { ProvinceAddRequst } from './../../../shared/models/request/provinceAddRequest';
import { DialogAddprovinceComponent } from './components/dialog-addprovince/dialog-addprovince.component';
import { MatDialog } from '@angular/material';
import { ProvinceService } from '../../../core/service/province/province.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, fromEvent } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RegionService } from 'src/app/core/service/region/region.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Message } from 'src/app/shared/message';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from '../../master-params/model/param';

export const _filter = (opt: any, value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.name.toLowerCase().indexOf(filterValue) != -1);
};

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent implements OnInit {
  @ViewChild('inputProvince', { static: false }) inputProvince: ElementRef;
  @ViewChild('deleteProvinceSwal', { static: false }) deleteProvinceSwal: SwalComponent;
  @ViewChild('deleteSuccussSwal', { static: false }) deleteSuccussSwal: SwalComponent;
  @ViewChild('errorProvinceSwal', { static: false }) errorProvinceSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  regionId: number;
  provinceId: number;
  mockProvinceList = new Array;
  regionName: any;
  province = new Array;
  stateValue: any;
  breadCrumProvinceName;
  breadcrumb: any;
  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: [''],
  });

  stateGroups = [{
    letter: 'จังหวัด',
    names: []
  }, {
    letter: 'อำเภอ',
    names: []
  }, {
    letter: 'ตำบล',
    names: []
  }
  ];
  searchLoading = false;
  stateGroupOptions: Observable<any>;
  constructor(
    private route: ActivatedRoute,
    private regionService: RegionService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private loading: NgxSpinnerService,
    private provinceService: ProvinceService,
    private dialogAdd: MatDialog,
    private sessionService: SessionServiceService,
    private paramService: ParamService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit() {
    this.getParamsActiveRoute();
    if (this.provinceId != 0) {
      this.getProvinceByProvinceId(this.provinceId);
    } else {
      this.getProvince();
    }
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  ngAfterViewInit() {
    this.onKeyUpSearch();
  }


  onKeyUpSearch() {
    fromEvent(this.inputProvince.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.searchLoading = true;
        return event.target.value;
      }),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      this.regionService.searchProvince(text)
        .subscribe(
          (res) => {
            // this.options = res;
            console.log('searchProvince ===== ', res);

            this.stateGroups[0].names = res.cpipMsProvince;
            this.stateGroups[1].names = res.cpipMsAmphur;
            this.stateGroups[2].names = res.cpipMsTambol;
            this.searchLoading = false;
          },
          (error) => {
            // this.options = [];
            console.log(error);
            this.searchLoading = false;
          }
        )
    }
    )
  }
  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }

  getbreadcrumbName() {
    let result = this.province.find(x => x.provinceCode);
    this.regionName = result.cpipMsRegion.regionName
    this.sessionService.setBreadcrumb(result.cpipMsRegion.regionName, "", "", "");
    this.breadcrumb = this.sessionService.getBreadcrumb();
    console.log(this.breadcrumb);
  }

  private _filterGroup(value: string): any {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }
    return this.stateGroups;
  }

  optionSelected(evt) {
    let e = evt.option.value;
    if (e.type === '0') {
      this.getProvinceByProvinceId(e.provinceId);
    }
    if (e.type === '1') {
      this.router.navigateByUrl('region/amphur', { state: { 'provinceId': e.provinceId, 'amphurId': e.amphur } })
    }
    if (e.type === '2') {
      // this.router.navigate(['/tambol/',e.amphur,e.tambol]);      
      this.router.navigateByUrl('region/tambol', { state: { 'amphurId': e.amphur, 'tambolId': e.tambol } })
    }
  }

  getProvince() {
    this.loading.show();
    this.regionService.getProvince(this.regionId)
      .subscribe(
        (res) => {
          this.province = res;
          console.log(this.province);
          this.loading.hide();
        },
        error => {
          this.province = [];
          console.log(error);
          this.loading.hide();
        }
      )
    this.breadcrumb = this.sessionService.getBreadcrumb();
  }

  getProvinceAll() {
    this.regionService.getAllProvince()
      .subscribe(
        (res) => {
          this.stateGroups[0].names = res.cpipMsProvince;
          this.stateGroups[1].names = res.cpipMsAmphur;
          this.loading.hide();
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        }
      )
  }

  getProvinceByProvinceId(provinceId: number) {
    this.loading.show();
    this.provinceService.getProvinceByProvinceId(provinceId)
      .subscribe(
        (res) => {
          this.province = res;
          this.getbreadcrumbName();
          this.loading.hide();
        },
        (error) => {
          this.loading.hide();
        }
      )
    this.breadcrumb = this.sessionService.getBreadcrumb();
  }

  getParamsActiveRoute() {
    this.stateValue = history.state;
    console.log("this.stateValue", this.stateValue);
    if (this.stateValue['regionId'] == undefined || this.stateValue['provinceId'] == undefined) {
      this.router.navigateByUrl("/region");
    } else {
      this.regionId = this.stateValue['regionId'];
      this.provinceId = this.stateValue['provinceId'];
    }
  }

  displayFn(data: any): string | undefined {
    return data ? data.name : undefined;
  }


  openDialog(): void {
    const dialogRef = this.dialogAdd.open(DialogAddprovinceComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: { regionId: this.regionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProvince();
      }
    });
  }

  deleteProvince(event) {
    this.loading.show();
    this.provinceService.deleteProvince(event.provinceCode)
      .subscribe(
        (res) => {
          this.loading.hide();
          this.deleteSuccussSwal.show();
          this.getProvince();
        },
        (error) => {
          this.loading.hide();
        }
      )
  }

  onEditProvince(province): void {
    const dialogRef = this.dialogAdd.open(DialogEditprovinceComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: { province }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProvince();
      }
    });
  }

  goToAmphur(e) {
    this.breadCrumProvinceName = e.provinceName
    this.sessionService.setBreadcrumb(e.cpipMsRegion.regionName, e.provinceName, "", "");
    this.sessionService.setBreadcrumbCode(e.cpipMsRegion.regionId, e.provinceId, 0, 0);
    this.router.navigateByUrl('region/amphur', { state: { 'provinceId': e.provinceId, 'amphurId': 0 } })
  }






}
