import { SessionServiceService } from './../../../core/service/common/session-service.service';
import { DialogEditamphurComponent } from './components/dialog-editamphur/dialog-editamphur.component';
import { DialogAddamphurComponent } from './components/dialog-addamphur/dialog-addamphur.component';
import { MatDialog } from '@angular/material';
import { AmphurService } from '../../../core/service/amphur/amphur.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
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
  selector: 'app-amphur',
  templateUrl: './amphur.component.html',
  styleUrls: ['./amphur.component.scss']
})
export class AmphurComponent implements OnInit {
  @ViewChild('inputAmphur', { static: false }) inputAmphur: ElementRef;
  @ViewChild('deleteAmphurSwal', { static: false }) deleteAmphurSwal: SwalComponent;
  @ViewChild('deleteSuccussSwal', { static: false }) deleteSuccussSwal: SwalComponent;
  @ViewChild('errorAmphurSwal', { static: false }) errorAmphurSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  @Input() breadCrumProvinceName;
  regionId: number;
  regionName: string;
  amphurId: number;
  provinceId: string;
  provinceName: string;
  amphur = new Array();
  stateValue: any;
  breadcrumb: any;
  searchLoading = false;
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
    private route: ActivatedRoute,
    private regionService: RegionService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private loading: NgxSpinnerService,
    private amphurServices: AmphurService,
    private dialog: MatDialog,
    private sessionService: SessionServiceService,
    private paramService: ParamService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  ngOnInit() {
    this.getParamsActiveRoute();
    if (this.amphurId != 0) {
      this.getAmphurById(this.amphurId);
    } else {
      this.getAmphur();
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
    fromEvent(this.inputAmphur.nativeElement, 'keyup').pipe(
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
    console.log(e);
    if (e.type === '0') {
      this.router.navigateByUrl('region/province', { state: { 'regionId': e.regionId, 'provinceId': e.provinceId } });
    }
    if (e.type === '1') {
      this.getAmphurById(e.amphur);
    }
    if (e.type === '2') {
      this.router.navigateByUrl('region/tambol', { state: { 'amphurId': e.amphur, 'tambolId': e.tambol } });
    }
  }

  getAmphurById(amphurId: number) {
    this.loading.show();
    this.amphurServices.getAmphurByAmphurId(amphurId)
      .subscribe(
        (res) => {
          this.amphur = res;
          this.getbreadcrumbName();
          console.log(res);
          this.loading.hide();
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        }
      )
  }

  getbreadcrumbName() {
    let resultAmphur = this.amphur.find(amphur => amphur.amphurCode);
    this.regionName = resultAmphur.cpipMsProvince.cpipMsRegion.regionName;
    this.provinceName = resultAmphur.cpipMsProvince.provinceName;
    this.regionId = resultAmphur.cpipMsProvince.cpipMsRegion.regionId;
    this.sessionService.setBreadcrumb(this.regionName, this.provinceName, "", "");
    this.sessionService.setBreadcrumbCode(this.regionId, 0, 0, 0);
    this.breadcrumb = this.sessionService.getBreadcrumb();
  }

  getAmphur() {
    this.loading.show();
    this.regionService.getAmphur(this.provinceId)
      .subscribe(
        res => {
          this.amphur = res;
          this.loading.hide();
        },
        error => {
          this.amphur = [];
          this.loading.hide();
        }
      )
    this.breadcrumb = this.sessionService.getBreadcrumb();
    console.log(this.breadcrumb);
  }

  getParamsActiveRoute() {
    this.stateValue = history.state;
    if (this.stateValue['amphurId'] == undefined || this.stateValue['provinceId'] == undefined) {
      this.router.navigateByUrl("/region");
    }
    this.amphurId = this.stateValue['amphurId'];
    this.provinceId = this.stateValue['provinceId'];
  }

  displayFn(data: any): string | undefined {
    return data ? data.name : undefined;
  }


  onAddAmphur(): void {
    const dialogRef = this.dialog.open(DialogAddamphurComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: this.provinceId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAmphur();
      }
    });
  }

  onEditAmphur(amphur): void {
    const dialogRef = this.dialog.open(DialogEditamphurComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: { amphur }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAmphur();
      }
    });
  }
  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }


  deleteAmphur(amphur) {
    console.log('delamp', amphur);
    this.loading.show();
    this.amphurServices.deleteAmphur(amphur.amphurCode, amphur.cpipMsProvince.provinceId)
      .subscribe(
        (res) => {
          this.loading.hide();
          this.deleteSuccussSwal.show();
          this.getAmphur();
        },
        (error) => {
          this.loading.hide();
          // this.errorAmphurSwal.title = error.error.message;
          // this.errorAmphurSwal.show();
        }
      )
  }

  goToTambol(e) {
    console.log(e);
    this.sessionService.setBreadcrumb(e.cpipMsProvince.cpipMsRegion.regionName, e.cpipMsProvince.provinceName, e.amphurName, "");
    this.sessionService.setBreadcrumbCode(e.cpipMsProvince.cpipMsRegion.regionId, e.cpipMsProvince.provinceId, e.amphurId, 0);
    this.router.navigateByUrl('region/tambol', { state: { 'provinceId': e.cpipMsProvince.provinceId, 'amphurId': e.amphurId, 'tambolId': 0 } });
  }

  backToProvince() {
    let backCode = this.sessionService.getBreadcrumbCode();
    this.router.navigateByUrl('region/province', { state: { 'regionId': backCode.region, 'provinceId': 0 } });
  }

}
