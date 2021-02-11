import {ViewStageFirstComponent} from './component/view-stage-first/view-stage-first.component';
import localeTh from '@angular/common/locales/th';
import {CalculatePtComponent} from './component/calculate-pt/calculate-pt.component';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {
  Component,
  OnInit,
  EventEmitter,
  ViewChild,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatStepper} from '@angular/material';
import {RebaseServiceService} from '../../core/service/rebase/rebase-service.service';
import {CurrentStage} from './models/current-stage';
import {NgxSpinnerService} from 'ngx-spinner';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {ViewStageSecondComponent} from './component/view-stage-second/view-stage-second.component';
import {ViewStageThirdComponent} from './component/view-stage-third/view-stage-third.component';
import {ViewStageFouthComponent} from './component/view-stage-fouth/view-stage-fouth.component';
import {ViewStageFifthComponent} from './component/view-stage-fifth/view-stage-fifth.component';
import {ViewStageSixthComponent} from './component/view-stage-sixth/view-stage-sixth.component';
import {ViewStageSeventhComponent} from './component/view-stage-seventh/view-stage-seventh.component';
import {ViewStageEightComponent} from './component/view-stage-eight/view-stage-eight.component';
import {ViewStageNineComponent} from './component/view-stage-nine/view-stage-nine.component';
import {ViewStageTenComponent} from './component/view-stage-ten/view-stage-ten.component';
import {ViewStageElevenComponent} from './component/view-stage-eleven/view-stage-eleven.component';
import {ViewStageTwelveComponent} from './component/view-stage-twelve/view-stage-twelve.component';
import {ViewStageThirteenComponent} from './component/view-stage-thirteen/view-stage-thirteen.component';
import {ViewStageFourteenComponent} from './component/view-stage-fourteen/view-stage-fourteen.component';
import {ViewStageFifteenComponent} from './component/view-stage-fifteen/view-stage-fifteen.component';
import {registerLocaleData} from '@angular/common';
import {ParamService} from 'src/app/core/service/param/param.service';
import {IndexMatrixService} from 'src/app/core/service/indexmatrix/index-matrix.service';
import {InquiryProvinceNameResponse} from 'src/app/shared/models/weight/request/InquiryProvinceNameResponse.model';
import {BaseyearService} from 'src/app/core/service/baseyear/baseyear.service';
import {UpdateNextStageRequest} from './models/update-next-stage-request';
import {SessionServiceService} from 'src/app/core/service/common/session-service.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {
  PPIMSRegion,
  Province,
} from 'src/app/shared/models/dataenty/request/Province';
import {ParamInfoCreateRequest} from 'src/app/shared/models/param/request/ParamInfoCreateRequest';
import {IndexGroupRes, ProvinceRes} from './models/request-param';
import {ViewStageThirdTwoComponent} from './component/view-stage-third-two/view-stage-third-two.component';
import {ResetRebaseRequest} from 'src/app/shared/models/baseYear/baseYear';
import {ProvinceService} from 'src/app/core/service/province/province.service';

@Component({
  selector: 'app-create-info-baseyear',
  templateUrl: './create-info-baseyear.component.html',
  styleUrls: ['./create-info-baseyear.component.scss'],
})
export class CreateInfoBaseyearComponent implements OnInit {
  @ViewChild('msgSwl', {static: false}) msgSwl: SwalComponent;
  @ViewChild(CalculatePtComponent, {static: false})
  calculatePtComponent: CalculatePtComponent;
  @ViewChild(ViewStageSecondComponent, {static: false})
  pageSecond: ViewStageSecondComponent;
  @ViewChild(ViewStageThirdComponent, {static: false})
  pageThird: ViewStageThirdComponent;
  @ViewChild(ViewStageThirdTwoComponent, {static: false})
  pageThirdTwo: ViewStageThirdTwoComponent;
  @ViewChild(ViewStageFouthComponent, {static: false})
  pageFourth: ViewStageFouthComponent;
  @ViewChild(ViewStageFifthComponent, {static: false})
  pageFifth: ViewStageFifthComponent;
  @ViewChild(ViewStageSixthComponent, {static: false})
  pageSixth: ViewStageSixthComponent;
  @ViewChild(ViewStageSeventhComponent, {static: false})
  pageSeventh: ViewStageSeventhComponent;
  @ViewChild(ViewStageEightComponent, {static: false})
  pageEight: ViewStageEightComponent;
  @ViewChild(ViewStageNineComponent, {static: false})
  pageNine: ViewStageNineComponent;
  @ViewChild(ViewStageTenComponent, {static: false})
  pageTen: ViewStageTenComponent;
  @ViewChild(ViewStageElevenComponent, {static: false})
  pageEleven: ViewStageElevenComponent;
  @ViewChild(ViewStageTwelveComponent, {static: false})
  pageTwelve: ViewStageTwelveComponent;
  @ViewChild(ViewStageThirteenComponent, {static: false})
  pageThirteen: ViewStageThirteenComponent;
  @ViewChild(ViewStageFourteenComponent, {static: false})
  pageFourteen: ViewStageFourteenComponent;
  @ViewChild(ViewStageFifteenComponent, {static: false})
  pageFifteen: ViewStageFifteenComponent;
  @ViewChild(ViewStageFirstComponent, {static: false})
  pageFirst: ViewStageFirstComponent;
  @ViewChild('systemCalculation', {static: false})
  systemCalculation: SwalComponent;
  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('stepperd', {static: false}) stepperd;
  @Input()
  selectedIndex: number;
  tabCurrent: number = 0;
  currentStage = 0;
  stage40: number = null;
  stage: number[] = [
    5.0,
    5.1,
    5.2,
    5.31,
    5.32,
    5.33,
    5.4,
    5.5,
    5.7,
    5.9,
    6.0,
    6.1,
    6.2,
    6.3,
    6.4,
  ];
  label: string[] = [
    'init weightbar',
    'init base price',
    'fill price',
    'weight bar and price bar',
    'cpa index',
    'rebase index',
    'publish index',
    'published index',
    '9',
    '10',
    '11',
    '12',
    '13',
  ];
  listIndexGroup: any;
  listStepGroup: any;
  isNewWeightThailand = false;
  isShowRegionInput = false;
  isShowProvinceInput = false;
  isShowSearch = false;
  isHaveWeight = false;
  listIndexMatrix = new Array();
  listIndexMatrixProvince = new Array();
  regionId;
  provinceId: ProvinceRes;
  indexGroup: IndexGroupRes;
  group;
  listProvinceData = new Array<ProvinceRes>();
  baseYear: any;
  searchActive: boolean;
  userProfile: any;
  userTypeProvince: any;
  checkUserProvince: boolean = false;
  checkdDisabled: boolean;
  checkdDisableProvince: boolean;
  filterProvinceOptions: Observable<any[]>;
  filterProvinceControl = new FormControl();
  filterRegionOptions: Observable<any[]>;
  filterRegionControl = new FormControl();
  filterIndexGroupOptions: Observable<any[]>;
  filterIndexGroupControl = new FormControl();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fourthTwoFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  isEditable = false;
  currentSelectedIndex: number;
  currentStageModel: UpdateNextStageRequest = new UpdateNextStageRequest();
  setValueUserProvince: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private loading: NgxSpinnerService,
    private rebaseService: RebaseServiceService,
    private paramService: ParamService,
    private indexMatrixService: IndexMatrixService,
    private baseYearService: BaseyearService,
    private sessionService: SessionServiceService,
    private changeDetector: ChangeDetectorRef,
    private provinceService: ProvinceService,
  ) {
    registerLocaleData(localeTh, 'th');
  }

  ngOnInit() {
    this.setFormGroup();
    this.getMaxBaseYear();
    this.getIndexGroup('INDEX_GROUP');
    this.filterRegionOptions = this.filterRegionControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        console.log(value);

        return value
          ? this._filterRegionList(value)
          : this.listIndexMatrix.slice();
      }),
    );

    this.filterIndexGroupOptions = this.filterIndexGroupControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        console.log(value);

        return value
          ? this._filterIndexGroupList(value)
          : this.listIndexGroup.slice();
      }),
    );
  }

  setFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required],
    });
    this.fourthTwoFormGroup = this._formBuilder.group({
      fourthTwoCtrl: ['', Validators.required],
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required],
    });
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required],
    });
    this.seventhFormGroup = this._formBuilder.group({
      seventhCtrl: ['', Validators.required],
    });
  }

  displayFilterProvince(province?: ProvinceRes): string | undefined {
    console.log('displayFilterProvince === ', province);

    return province
      ? province.provinceCode + ' ' + province.provinceName
      : undefined;
  }

  displayFilterRegion(region?: PPIMSRegion): string | undefined {
    return region ? region.regionName : undefined;
  }

  displayFilterIndexGroup(indexGroup?: IndexGroupRes): string | undefined {
    console.log('indexGroup', indexGroup);

    return indexGroup ? indexGroup.paramInfo : undefined;
  }

  private _filterProvinceList(province: string): any[] {
    const filterValue = province;

    let selectProvince = this.listProvinceData.filter(
      (option) =>
        option.provinceCode.toString().startsWith(filterValue) ||
        option.provinceName.toString().startsWith(filterValue),
    );
    return selectProvince;
  }

  private _filterRegionList(region: string): any[] {
    const filterValue = region;

    let selectRegion = this.listIndexMatrix.filter((option) =>
      option.regionName.toString().startsWith(filterValue),
    );
    console.log('selectRegion =====> ', selectRegion);

    return selectRegion;
  }

  private _filterIndexGroupList(indexGroup: string): any[] {
    const filterValue = indexGroup;

    let selectIndexGroup = this.listIndexGroup.filter((option) =>
      option.paramInfo.toString().startsWith(filterValue),
    );
    return selectIndexGroup;
  }

  getUserProfile() {
    this.userProfile = this.sessionService.getUserProfile();
    if (this.userProfile.provinceId !== null) {
      this.isShowSearch = true;
      console.log(this.isShowSearch);
      this.checkdDisableProvince = true;
      this.setValueUserProvince = true;
      console.log(this.checkdDisableProvince);
      this.userTypeProvince = this.userProfile.provinceId;
      this.filterProvinceControl.setValue(
        this.filterProvince(this.userTypeProvince),
      );
      this.provinceId = this.filterProvince(this.userTypeProvince);
      this.indexGroup = this.filterIndexGroup('CPIP');

      this.currentStageModel.paramCode = this.indexGroup.paramInfo;
      this.currentStageModel.provinceId = this.provinceId.provinceId;
      this.isShowProvinceInput = true;
      this.checkdDisabled = true;
      if (this.checkdDisabled == true) {
        this.filterIndexGroupControl.disable();
        this.filterProvinceControl.disable();
      }
      this.checkUserProvince = true;
    } else {
      this.userTypeProvince = 0;
      this.filterProvinceControl.setValue(
        this.listProvinceData.find((x) => x.provinceName === 'กรุงเทพมหานคร'),
      );
    }
  }

  filterProvince(userTypeProvince: number): ProvinceRes {
    const province = this.listProvinceData.find((province) => {
      return province.provinceId === userTypeProvince;
    });
    return province;
  }

  filterIndexGroup(info: string) {
    const filterValue = info;
    let selectIndexGroup;
    if (info === 'CPIP' && this.setValueUserProvince) {
      selectIndexGroup = this.listIndexGroup.find((option) =>
        option.paramInfo.toString().startsWith(filterValue),
      );
    } else {
      selectIndexGroup = this.listIndexGroup.filter((option) =>
        option.paramInfo.toString().startsWith(filterValue),
      );
    }
    return selectIndexGroup;
  }

  parentMedthod(step) {
    let stepTest = step;
    console.log(stepTest);
  }

  onSearch() {
    let currentStage = new UpdateNextStageRequest();
    this.isEditable = false;
    if (this.userProfile.provinceId !== null) {
      this.group = this.listIndexGroup.find(
        (i) => i.paramId === this.indexGroup.paramId,
      );
      currentStage.paramCode = this.group.paramInfo;
      currentStage.provinceId = this.filterProvinceControl.value.provinceId;
    } else {
      currentStage.paramCode = this.group.paramInfo;
      if (this.isShowProvinceInput === true) {
        currentStage.provinceId = this.filterProvinceControl.value.provinceId;
      } else {
        currentStage.regionId = this.regionId.regionId;
      }
    }
    this.stage40 = null;
    this.rebaseService.getCurrentStage(currentStage).subscribe(
      (cs: CurrentStage) => {
        this.checkdDisabled = true;
        this.stage40 = cs.currentStage;
        this.setValidateFromGroup(this.stage40);
        this.checkdDisableProvince = false;
        this.filterIndexGroupControl.disable();
        this.filterProvinceControl.disable();
        this.filterRegionControl.disable();
        const index = this.stage.indexOf(cs.currentStage);
        this.currentStage = index;
      },
      (error) => {
        console.log(error);
        this.checkdDisabled = false;
        this.checkdDisableProvince = false;
        if (this.checkdDisabled == false) {
          this.searchActive = false;
          this.filterIndexGroupControl.enable();
          this.filterProvinceControl.enable();
          this.filterRegionControl.enable();
        }
        if (this.userProfile.provinceId !== null) {
          this.filterIndexGroupControl.disable();
          this.filterProvinceControl.disable();
          this.checkdDisableProvince = true;
        }
      },
    );
  }

  setValidateFromGroup(stage) {
    if (stage === 5.0) {
      this.selectionChange(null, 0);
    } else if (stage === 5.1) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.selectionChange(null, 1);
    } else if (stage === 5.2) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.secondFormGroup.controls['secondCtrl'].setValue('step02');
      this.selectionChange(null, 2);
    } else if (stage === 5.31) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.secondFormGroup.controls['secondCtrl'].setValue('step02');
      this.thirdFormGroup.controls['thirdCtrl'].setValue('step03');
      this.selectionChange(null, 3);
    } else if (stage === 5.32) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.secondFormGroup.controls['secondCtrl'].setValue('step02');
      this.selectionChange(null, 4);
    } else if (stage === 5.33) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.secondFormGroup.controls['secondCtrl'].setValue('step02');
      this.thirdFormGroup.controls['thirdCtrl'].setValue('step03');
      this.selectionChange(null, 5);
    } else if (stage === 5.4) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.secondFormGroup.controls['secondCtrl'].setValue('step02');
      this.thirdFormGroup.controls['thirdCtrl'].setValue('step03');
      this.fourthFormGroup.controls['fourthCtrl'].setValue('step04');
      this.selectionChange(null, 6);
    } else if (stage >= 5.5) {
      this.firstFormGroup.controls['firstCtrl'].setValue('step01');
      this.secondFormGroup.controls['secondCtrl'].setValue('step02');
      this.thirdFormGroup.controls['thirdCtrl'].setValue('step03');
      this.fourthFormGroup.controls['fourthCtrl'].setValue('step04');
      this.fourthTwoFormGroup.controls['fourthTwoCtrl'].setValue('step04_2');
      this.selectionChange(null, 7);
    }
  }

  setSelectedIndex() {
    // let currentStage = new UpdateNextStageRequest();
    // this.isEditable = false;
    // if (this.userProfile.provinceId !== null) {
    //   this.group = this.listIndexGroup.find(i => i.paramId === this.indexGroup.paramId);
    //   currentStage.paramCode = this.group.paramInfo;
    //   currentStage.provinceId = this.filterProvinceControl.value.provinceId;
    // } else {
    //   currentStage.paramCode = this.group.paramInfo;
    //   if (this.isShowProvinceInput === true) {
    //     currentStage.provinceId = this.filterProvinceControl.value.provinceId;
    //   } else {
    //     currentStage.regionId = this.regionId.regionId;
    //   }
    // }
    // this.rebaseService.getCurrentStage(currentStage).subscribe(
    //   (cs: CurrentStage) => {
    //     this.stage40 = cs.currentStage;
    //     console.log('stage40 ==== ', this.stage40);
    //     if (this.stage40 == 5.1) {
    //       this.currentSelectedIndex = 0;
    //     }
    //     else if (this.stage40 === 5.2) {
    //       this.currentSelectedIndex = 1;
    //     } else if (this.stage40 === 5.31) {
    //       this.currentSelectedIndex = 2;
    //     } else if (this.stage40 === 5.32) {
    //       this.currentSelectedIndex = 3;
    //     } else if (this.stage40 === 5.33) {
    //       this.currentSelectedIndex = 4;
    //     } else if (this.stage40 === 5.4) {
    //       this.currentSelectedIndex = 5;
    //     } else if (this.stage40 === 5.5) {
    //       this.currentSelectedIndex = 6;
    //     } else if (this.stage40 >= 5.7) {
    //       this.currentSelectedIndex = 7;
    //     }
    //   }, (error) => {
    //     console.log(error);
    //   }
    // );
  }
  clearSearch() {
    if (this.userProfile.provinceId !== null) {
      this.isShowRegionInput = false;
      this.isShowProvinceInput = true;
      this.checkdDisabled = true;
      if (this.checkdDisabled == true) {
        this.filterIndexGroupControl.disable();
        this.filterProvinceControl.disable();
        this.filterRegionControl.disable();
        this.searchActive = false;
      }
      this.isShowSearch = true;
      this.checkdDisableProvince = true;
    } else {
      this.isShowRegionInput = false;
      this.isShowProvinceInput = false;
      this.indexGroup = null;
      this.provinceId = null;
      this.regionId = null;
      this.filterProvinceControl.setValue(null);
      this.isShowSearch = false;
      this.checkdDisabled = false;
      this.searchActive = false;
      if (this.checkdDisabled == false) {
        this.filterIndexGroupControl.enable();
        this.filterProvinceControl.enable();
        this.filterRegionControl.enable();
      }
    }
    this.stage40 = null;
    this.setFormGroup();
  }

  getParamsStep(paramGroup: string, info: string) {
    const paramsStep = this.paramService.getParamByGroupCodeAndInfoCode(
      paramGroup,
      info,
    );
    return paramsStep.paramLocalMessage;
  }

  getIndexGroup(paramsGroup) {
    this.listIndexGroup = this.paramService.getParamByGroup(paramsGroup);

    console.log('indexGroup ==== > ', this.listIndexGroup);
    // this.setProvinceData();
  }

  selectIndexGroup(event) {
    console.log('eventSelectIndexGroup === ', event);

    this.isNewWeightThailand = false;
    // this.indexGroup = 969;
    let paramId = event ? event.paramId : null;

    this.group = this.listIndexGroup.find((i) => i.paramId === paramId);

    if (this.group && this.group.paramInfo === 'CPIP') {
      this.isShowProvinceInput = true;
      this.isShowRegionInput = false;
      if (
        this.userProfile.provinceId === null &&
        this.filterProvinceControl.value
      ) {
        this.checkdDisableProvince = true;
      }
    } else {
      // this.isShowProvinceInput = false;
      // this.isShowRegionInput = true;
    }

    this.isShowSearch = false;
    this.listIndexMatrix = new Array();
    this.listIndexMatrixProvince = new Array();
    this.regionId = null;
    this.provinceId = null;
    this.loading.show();
    console.log('e value onSelectIndexGroup => ', this.indexGroup);
    if (this.group && this.group.paramInfo != 'CPIP') {
      this.indexMatrixService
        .inquiryIndexMatrix(this.indexGroup ? this.indexGroup.paramId : null)
        .subscribe(
          (res) => {
            this.loading.hide();
            console.log('res regionnn', res.regionNameList);
            if (res.regionNameList.length !== 0) {
              this.listIndexMatrix = res.regionNameList;
              console.log(
                'this.listIndexMatrix =========== ',
                this.listIndexMatrix,
              );
            }
            this.isShowProvinceInput = false;
            this.isShowRegionInput = true;
          },
          (error) => {
            this.loading.hide();
          },
        );
    } else {
      this.loading.hide();
      console.log('isShowProvinceInput value => ', this.isShowProvinceInput);
    }
  }

  setProvinceData() {
    this.loading.show();
    let indexGroup = this.listIndexGroup.find((x) => x.paramInfo === 'CPIP');
    if (indexGroup != null) {
      this.provinceService.getProvinceAll().subscribe(
        (res) => {
          this.loading.hide();
          this.listProvinceData = res;
          console.log('listProvince === >', this.listProvinceData);
          this.filterProvinceOptions = this.filterProvinceControl.valueChanges.pipe(
            startWith(''),
            map((value) => {
              console.log(value);

              return value
                ? this._filterProvinceList(value)
                : this.listProvinceData.slice();
            }),
          );
          this.getUserProfile();
        },
        (error) => {
          this.loading.hide();
        },
      );
    }
  }

  onSelectRegion(e) {
    this.isShowSearch = true;
    this.checkdDisabled = false;
    this.checkdDisableProvince = true;
  }

  getMaxBaseYear() {
    this.baseYearService.getMaxBaseYear().subscribe(
      (res) => {
        this.baseYear = res.baseYear;
        console.log(this.baseYear);
        this.setProvinceData();
      },
      (error) => {
        console.log(error);
      },
    );
  }

  selectionChange(event: any, value: number) {
    console.log(event, value);
    this.currentSelectedIndex = event ? event.selectedIndex : value;
    console.log('this.currentSelectedIndex', this.currentSelectedIndex);
    this.searchActive = true;
    if (event == null) {
      this.changeDetector.detectChanges();
    }
    if (this.currentSelectedIndex === 0) {
      this.pageFirst.prepage();
    } else if (this.currentSelectedIndex === 1) {
      this.pageSecond.preparePage();
    } else if (this.currentSelectedIndex === 2) {
      this.calculatePtComponent.prepage();
    } else if (this.currentSelectedIndex === 3) {
      this.pageThird.preparePage();
    } else if (this.currentSelectedIndex === 4) {
      this.pageThirdTwo.preparePage();
    } else if (this.currentSelectedIndex === 5) {
      this.pageFourth.preparePage();
    } else if (this.currentSelectedIndex === 6) {
      this.pageFifth.preparePage();
    } else if (this.currentSelectedIndex === 7) {
      this.pageSixth.preparePage();
    }
  }

  public goNext(stepper: MatStepper, stage: number): void {
    this.loading.show();
    let currentStage = new UpdateNextStageRequest();
    currentStage.paramCode = this.group.paramInfo;
    if (this.isShowProvinceInput === true) {
      currentStage.provinceId = this.filterProvinceControl.value.provinceId;
    } else {
      currentStage.regionId = this.regionId.regionId;
    }
    this.rebaseService.getCurrentStage(currentStage).subscribe(
      (cs: CurrentStage) => {
        this.stage40 = cs.currentStage;
        if (cs.currentStage === stage) {
          this.rebaseService.nextStage(currentStage).subscribe(
            (response) => {
              const index = this.stage.indexOf(cs.currentStage);
              this.currentStage = index;
              this.loading.hide();
              if (this.stage40 === 5.2) {
                this.setValidateFromGroup(5.31);
              } else {
                this.setValidateFromGroup(this.stage40);
              }
              this.rebaseService.getCurrentStage(currentStage).subscribe(
                (cs: CurrentStage) => {
                  this.stage40 = cs.currentStage;
                },
                (error) => {
                  this.loading.hide();
                  console.log(error);
                },
              );
            },
            (error) => {
              this.loading.hide();
              console.log(error);
            },
          );
        } else if (cs.currentStage > stage) {
          this.loading.hide();
          stepper.next();
        } else {
          this.loading.hide();
          this.systemCalculation.title = 'ระบบกำลังคำนวนขั้นตอนที่ ' + stage;
          this.systemCalculation.show();
        }
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  public goPrev(stepper: MatStepper): void {
    this.loading.show();
    this.rebaseService.prevStage().subscribe(
      (response) => {
        this.currentStage = response.currentStage;
        this.loading.hide();
        stepper.previous();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  getStep40() {
    this.loading.show();
    let currentStage = new UpdateNextStageRequest();
    currentStage.paramCode = this.group.paramInfo;
    if (this.isShowProvinceInput === true) {
      currentStage.provinceId = this.filterProvinceControl.value.provinceId;
    } else {
      currentStage.regionId = this.regionId.regionId;
    }
    this.rebaseService.nextStage(currentStage).subscribe(
      (res) => {
        this.loading.hide();
        this.stage40 = 5.1;
        this.pageFirst.prepage();
        console.log(res);
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }

  optionalCheckStage(stage: number) {
    if (this.stage40 >= stage) {
      return true;
    } else {
      return false;
    }
  }

  changeStage(event) {
    console.log(event);
    this.setValidateFromGroup(event);
  }

  resetRebase() {
    this.loading.show();
    let request = new ResetRebaseRequest();
    let province = this.filterProvinceControl.value as ProvinceRes;
    request.indexGroup = this.indexGroup ? this.indexGroup.paramId : null;
    request.provinceId = province ? province.provinceId : null;
    request.regionId = this.regionId ? this.regionId.regionId : null;
    console.log(request);
    this.rebaseService.resetRebase(request).subscribe(
      (res) => {
        this.loading.hide();
        this.msgSwl.title = 'ยกเลิกข้อมูลปีฐานสำเร็จ';
        this.msgSwl.show();
        this.clearSearch();
      },
      (error) => {
        this.loading.hide();
      },
    );
  }
}
