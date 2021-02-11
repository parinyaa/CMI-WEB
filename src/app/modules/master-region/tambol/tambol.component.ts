import { SessionServiceService } from './../../../core/service/common/session-service.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TambolEditRequest } from 'src/app/shared/models/tambol/request/tambolEditRequest';
import { TambolAddRequest } from 'src/app/shared/models/tambol/request/tambolAddRequst';
import { Observable, fromEvent } from 'rxjs';
import { DialogEdittambolComponent } from './components/dialog-edittambol/dialog-edittambol.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TambolserviceService } from './../../../core/service/tambol/tambolservice.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogAddtambolComponent } from './components/dialog-addtambol/dialog-addtambol.component';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RegionService } from 'src/app/core/service/region/region.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Message } from 'src/app/shared/message';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from '../../master-params/model/param';
export const _filter = (opt: any, value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.name.toLowerCase().indexOf(filterValue) != -1);
};
@Component({
  selector: 'app-tambol',
  templateUrl: './tambol.component.html',
  styleUrls: ['./tambol.component.scss']
})
export class TambolComponent implements OnInit {
  @ViewChild('inputTambol', { static: false }) inputTambol: ElementRef;
  @ViewChild('deleteSuccussSwal', { static: false }) deleteSuccussSwal: SwalComponent
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  amphurId: number;
  tambolId: number;
  provinceIdActive: number;
  tambol: any;
  regionName: string;
  provinceName: string;
  amphurName: string;
  regionId: number;
  provinceId: number;
  stateValue: any;
  searchLoading = false;
  breadcrumb: any;
  tambolTotal = 0;
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
  stateGroupOptions: Observable<any>;
  constructor(
    private tambolService: TambolserviceService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private regionService: RegionService,
    private loading: NgxSpinnerService,
    private tambolEditRequest: TambolEditRequest,
    private sessionService: SessionServiceService,
    private paramService: ParamService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit() {
    this.getParamsActiveRoute();
    if (this.tambolId != 0) {
      this.getTambolById(this.tambolId);
    } else {
      this.getTambol();
    }
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }

  ngAfterViewInit() {
    this.onKeyUpSearch();
  }

  onKeyUpSearch() {
    fromEvent(this.inputTambol.nativeElement, 'keyup').pipe(
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
            this.stateGroups[0].names = res.cpipMsProvince;
            this.stateGroups[1].names = res.cpipMsAmphur;
            this.stateGroups[2].names = res.cpipMsTambol;
            this.searchLoading = false;
          },
          (error) => {
            console.log(error);
            this.searchLoading = false;
          }
        )
    }
    )
  }

  getTambol() {
    this.loading.show();
    this.tambolService.getTambol(this.amphurId)
      .subscribe(
        (res) => {
          this.tambol = res;
          this.tambolTotal = this.tambol.length;
          console.log('totaltambol', this.tambolTotal);
          // this.getbreadcrumbName();
          this.loading.hide();
          console.log(res);
        },
        (error) => {
          this.tambol = [];
          console.log(error);
          this.loading.hide();
        }
      )
    this.breadcrumb = this.sessionService.getBreadcrumb();
  }

  getTambolById(tambolId) {
    this.loading.show();
    this.tambolService.getTambolById(tambolId)
      .subscribe(
        (res) => {
          this.tambol = res;
          this.getbreadcrumbName();
          this.loading.hide();
          console.log(res);
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        }
      )
  }

  getParamsActiveRoute() {
    this.stateValue = history.state;
    if (this.stateValue['amphurId'] == undefined || this.stateValue['tambolId'] == undefined) {
      this.router.navigateByUrl("/region");
    } else {
      this.amphurId = this.stateValue['amphurId'];
      this.tambolId = this.stateValue['tambolId'];
      this.provinceIdActive = this.stateValue['provinceId'];
      console.log("this.provinceIdActive", this.provinceIdActive);
    }
  }

  getbreadcrumbName() {
    let resultTambol = this.tambol.find(tambol => tambol.tambolCode);
    console.log(resultTambol);
    this.regionName = resultTambol.cpipMsAmphur.cpipMsProvince.cpipMsRegion.regionName;
    this.provinceName = resultTambol.cpipMsAmphur.cpipMsProvince.provinceName;
    this.provinceId = resultTambol.cpipMsAmphur.cpipMsProvince.provinceId;
    this.regionId = resultTambol.cpipMsAmphur.cpipMsProvince.cpipMsRegion.regionId;
    this.amphurName = resultTambol.cpipMsAmphur.amphurName;
    this.sessionService.setBreadcrumb(this.regionName, this.provinceName, this.amphurName, "");
    this.sessionService.setBreadcrumbCode(this.regionId, this.provinceId, 0, 0);
    this.breadcrumb = this.sessionService.getBreadcrumb();
  }

  onAddTambol(): void {
    console.log(this.provinceId);
    const dialogRef = this.dialog.open(DialogAddtambolComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: { amphurId: this.amphurId, provinceId: this.provinceIdActive }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTambol();
      }
    });
  }

  onEditTambol(data): void {
    const dialogRef = this.dialog.open(DialogEdittambolComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTambol();
      }
    });
  }

  displayFn(data: any): string | undefined {
    return data ? data.name : undefined;
  }

  deleteTambol(e) {
    this.loading.show();
    console.log('eeee', e);
    this.tambolService.deleteTambol(e.tambolCode, e.cpipMsAmphur.amphurId).subscribe(

      (res) => {
        this.loading.hide();
        this.deleteSuccussSwal.show();
        this.getTambol();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  optionSelected(evt) {
    let e = evt.option.value;
    console.log(e);
    if (e.type === '0') {
      this.router.navigateByUrl('region/province', { state: { 'regionId': e.regionId, 'provinceId': e.provinceId } });
    }
    if (e.type === '1') {
      this.router.navigateByUrl('region/amphur', { state: { 'provinceId': e.provinceId, 'amphurId': e.amphur } });
    }
    if (e.type === '2') {
      this.getTambolById(e.tambol);
    }
  }

  private _filterGroup(value: string): any {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }
    return this.stateGroups;
  }

  backToAmphur() {
    let backCode = this.sessionService.getBreadcrumbCode();
    this.router.navigateByUrl('region/amphur', { state: { 'provinceId': backCode.province, 'amphurId': 0 } });
  }

  backToprovince() {
    let backCode = this.sessionService.getBreadcrumbCode();
    this.router.navigateByUrl('region/province', { state: { 'regionId': backCode.region, 'provinceId': 0 } });
  }

}
