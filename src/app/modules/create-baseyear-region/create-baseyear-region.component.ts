import { Component, OnInit, ViewChild, ViewChildren, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from '../master-params/model/param';
import { IndexGroupRes } from '../create-info-baseyear/models/request-param';
import { NgxSpinnerService } from 'ngx-spinner';
import { IndexMatrixService } from 'src/app/core/service/indexmatrix/index-matrix.service';
import { MatAutocompleteSelectedEvent, MatOptionSelectionChange, MatTableDataSource } from '@angular/material';
import { BaseyearCpipService } from 'src/app/core/service/baseyearcpip/baseyear-cpip.service';
import { InquireRegionStep, UpdateRegionProportionRequest, ParamRequest, RegionStepResponse, InquiryRegionStepResponse, cpipTrWeight, CallStageRequest } from 'src/app/shared/models/createBaseYear/InquireRegionStep';
import { RegionStepService } from 'src/app/core/service/regionStep/region-step.service';
import { StageFirstComponent } from './component/stage-first/stage-first.component';
import { StageThirdComponent } from './component/stage-third/stage-third.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { StageFouthComponent } from './component/stage-fouth/stage-fouth.component';
import { StageFifthComponent } from './component/stage-fifth/stage-fifth.component';
import { StageSecondComponent } from './component/stage-second/stage-second.component';
import { RebaseServiceService } from 'src/app/core/service/rebase/rebase-service.service';
import { ResetRebaseRequest } from 'src/app/shared/models/baseYear/baseYear';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-create-baseyear-region',
  templateUrl: './create-baseyear-region.component.html',
  styleUrls: ['./create-baseyear-region.component.scss']
})
export class CreateBaseyearRegionComponent implements OnInit {
  @ViewChild("msgSwl", { static: false }) msgSwl: SwalComponent;
  @ViewChild(StageFirstComponent, { static: false }) public pageFirst: StageFirstComponent;
  @ViewChild(StageSecondComponent, { static: false }) public pageSecond: StageSecondComponent;
  @ViewChild(StageThirdComponent, { static: false }) public pageThird: StageThirdComponent;
  @ViewChild(StageFouthComponent, { static: false }) public pageFouth: StageFouthComponent;
  @ViewChild(StageFifthComponent, { static: false }) public pageFifth: StageFifthComponent;
  filterBaseYearOptions: Observable<any[]>;
  filterRegionOptions: Observable<any[]>;
  filterIndexGroupOptions: Observable<any[]>;
  baseYearControl = new FormControl();
  indexGroupControl = new FormControl();
  regionList = new Array();
  indexGroupList = new Array();
  indexGroup = new IndexGroupRes();
  listIndexMatrix = new Array();
  listBaseYear = new Array();
  isShowRegion = false;
  isShowRefresh = false;
  isShowSearch = false;
  baseYear = null;
  displayedColumns: string[] = ['region', 'public', 'avg'];
  dataSource = new MatTableDataSource();
  proportion = 0;
  endStage = 5.7;
  stagePage = false;
  paramRequest = new ParamRequest();
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fouthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  tabCurrent = 0;
  weightRegion = new cpipTrWeight();
  stepNo = 5;
  constructor(
    private paramService: ParamService,
    private loading: NgxSpinnerService,
    private indexMatrixService: IndexMatrixService,
    private baseyearCpipService: BaseyearCpipService,
    private regionStepService: RegionStepService,
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private rebaseService: RebaseServiceService
  ) { }


  ngOnInit() {
    this.setFormGroup();
    this.inquiryBaseYear();
  }

  inquiryBaseYear() {
    this.loading.show();
    this.baseyearCpipService.inquiryBaseYear().subscribe((res) => {
      this.loading.hide();
      this.listBaseYear = res.data;
      this.listBaseYear = this.listBaseYear.filter(x => x.status === 'NEW');
      this.filterBaseYearOptions = this.baseYearControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            return value ? this._filterBaseYear(value) : this.listBaseYear.slice();
          })
        );
      this.getIndexGroup();
    }, (error) => {
      this.loading.hide();
    });
  }

  getIndexGroup() {
    let listGroup = this.paramService.getParamByGroup("INDEX_GROUP") as Array<ParamInfo>;
    this.indexGroupList = listGroup.filter(x => x.paramInfo != "CPIP");
    this.filterIndexGroupOptions = this.indexGroupControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          return value ? this._filterIndexGroupList(value) : this.indexGroupList.slice();
        })
      );
  }

  onSearch() {
    this.loading.show();
    this.isShowRefresh = true;
    this.isShowSearch = false;
    let request = new InquireRegionStep();
    request.baseYearId = this.baseYear ? this.baseYear.baseYearId : null;
    request.indexGroup = this.indexGroup ? this.indexGroup.paramId : null;
    this.regionStepService.getRegionStep(request).subscribe((res: RegionStepResponse) => {
      this.loading.hide();
      let region = res ? res.region : [];
      this.weightRegion = res ? res.cpipTrWeight : null;
      this.stepNo = this.weightRegion ? this.weightRegion.stepNo : null;
      this.paramRequest.indexGroup = this.indexGroup ? this.indexGroup.paramId : null;
      this.paramRequest.baseYearId = this.baseYear ? this.baseYear.baseYearId : null;
      this.paramRequest.regionId = this.weightRegion && this.weightRegion.region ? this.weightRegion.region.regionId : null;
      // if (this.stepNo === 5 || this.stepNo == null) {
      this.regionList = this.setRegionStep(this.weightRegion, region)
      this.dataSource = new MatTableDataSource(this.regionList);
      this.calProportion();
      console.log("this.stepNo", this.stepNo);
      // } else if (this.stepNo > 5) {
      //   this.nextStep(this.stepNo);
      // }
    }, (error) => {
      this.loading.hide();
    })
  }

  setRegionStep(weight: cpipTrWeight, region: Array<InquiryRegionStepResponse>) {
    if (weight) {
      region.map((x, index: number) => {
        if (index === 0) {
          x.proportion = weight.region0;
        } else if (index === 1) {
          x.proportion = weight.region1;
        } else if (index === 2) {
          x.proportion = weight.region2;
        } else if (index === 3) {
          x.proportion = weight.region3;
        } else if (index === 4) {
          x.proportion = weight.region4;
        }
        x.stepNo = this.endStage;
        return x;
      })
    } else {
      region.map(x => { x.proportion = null; return x })
    }
    return region;
  }

  selectIndexGroup(e: MatAutocompleteSelectedEvent) {
    this.listIndexMatrix = new Array();
    this.isShowSearch = true;
  }


  private _filterIndexGroupList(indexGroup: string): any[] {
    const filterValue = indexGroup
    let selectIndexGroup = this.indexGroupList.filter(option =>
      option.paramInfo.toString().startsWith(filterValue)
    )
    return selectIndexGroup;
  }

  private _filterBaseYear(indexGroup: string): any[] {
    const filterValue = indexGroup
    let selectIndexGroup = this.listBaseYear.filter(option =>
      option.baseYear.toString().startsWith(filterValue)
    )
    return selectIndexGroup;
  }

  displayFilterIndexGroup(indexGroup?: ParamInfo): string | undefined {
    return indexGroup ? indexGroup.paramInfo : undefined;
  }

  displayFilterBaseYear(baseYear?: any): string | undefined {
    console.log(baseYear);
    return baseYear ? baseYear.baseYear : undefined;
  }

  onSelectRegion(e: MatOptionSelectionChange) {
    if (e.source.value) {
      this.isShowSearch = true;
    }
  }

  clearSearch() {
    this.baseYear = null;
    this.indexGroup = null;
    this.isShowRegion = false;
    this.isShowRefresh = false;
    this.isShowSearch = false;
    this.stagePage = false;
    this.stepNo = 5;
    this.dataSource = new MatTableDataSource();
  }

  calProportion() {
    let count = 0;
    this.regionList.map(p => {
      count = count + p.proportion
    })
    this.proportion = count;
  }

  onSave() {
    this.loading.show();
    let request = new UpdateRegionProportionRequest();
    request.baseYearId = this.baseYear ? this.baseYear.baseYearId : null;
    request.indexGroup = this.indexGroup ? this.indexGroup.paramId : null;
    request.region0 = this.regionList[0].proportion;
    request.region1 = this.regionList[1].proportion;
    request.region2 = this.regionList[2].proportion;
    request.region3 = this.regionList[3].proportion;
    request.region4 = this.regionList[4].proportion;
    this.regionStepService.updateRegionStep(request).subscribe(res => {
      this.loading.hide();
      this.stagePage = true;
      this.selectionChange(null, 0);
      this.nextStep(this.stepNo);
    }, (error) => {
      this.stagePage = false;
      this.loading.hide();
    })
  }

  nextStep(stepNo: number) {
    console.log("stepNo", stepNo);
    this.stagePage = true;
    if (stepNo == 5.1) {
      this.selectionChange(null, 1);
    } else if (stepNo == 5.2) {
      this.selectionChange(null, 2);
    } else if (stepNo == 5.3) {
      this.selectionChange(null, 3);
    } else if (stepNo >= 5.4) {
      this.selectionChange(null, 4);
    } else {
      this.selectionChange(null, 0);
    }
  }


  nextStage() {
    this.loading.show();
    let request = new CallStageRequest();
    request.baseYearId = this.paramRequest ? this.paramRequest.baseYearId : null;
    request.indexGroup = this.paramRequest ? this.paramRequest.indexGroup : null;
    request.regionId = this.paramRequest ? this.paramRequest.regionId : null;
    this.regionStepService.nextStage(request).subscribe((res) => {
      this.loading.hide();
      this.stagePage = true;
      this.nextStep(this.stepNo);
      this.getCurrentStage();
    }, (error) => {
      this.loading.hide();
    })
  }

  getCurrentStage() {
    let request = new CallStageRequest();
    request.baseYearId = this.paramRequest ? this.paramRequest.baseYearId : null;
    request.indexGroup = this.paramRequest ? this.paramRequest.indexGroup : null;
    request.regionId = this.paramRequest ? this.paramRequest.regionId : null;
    this.regionStepService.currentStage(request).subscribe((res: cpipTrWeight) => {
      console.log(res);
      this.stepNo = res ? res.stepNo : null;

    }, (error) => {
      console.log(error);
    })
  }

  changeStep() {
    this.nextStage();
  }

  setStepFormGroup(stepNo: number) {
    if (stepNo == 5.1) {
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: [true, Validators.required]
      });
    } else if (stepNo == 5.2) {
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: [true, Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: [true, Validators.required]
      });
    } else if (stepNo == 5.3) {
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: [true, Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: [true, Validators.required]
      });
      this.thirdFormGroup = this._formBuilder.group({
        thirdCtrl: [true, Validators.required]
      });
    }
    else if (stepNo == 5.4) {
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: [true, Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: [true, Validators.required]
      });
      this.thirdFormGroup = this._formBuilder.group({
        thirdCtrl: [true, Validators.required]
      });
      this.fouthFormGroup = this._formBuilder.group({
        fouthCtrl: [true, Validators.required]
      });
    }
    this.nextStep(stepNo);
  }



  setFormGroup() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fouthFormGroup = this._formBuilder.group({
      fouthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
  }

  selectionChange(e: StepperSelectionEvent, index: number) {
    this.tabCurrent = e ? e.selectedIndex : index;
    console.log('tabCurrent', this.tabCurrent);
    console.log('stepNo', this.stepNo);
    if (e == null) {
      this.changeDetector.detectChanges();
    }
    if (this.tabCurrent === 0) {
      this.pageFirst.preparePage();
    } else if (this.tabCurrent === 1) {
      this.pageSecond.preparePage();
    } else if (this.tabCurrent === 2) {
      this.pageThird.preparePage();
    } else if (this.tabCurrent === 3) {
      this.pageFouth.preparePage();
    } else if (this.tabCurrent === 4) {
      this.pageFifth.preparePage();
    }
  }

  checkStepEnd() {
    let countStep = 0;
    let countProportion = 0
    this.regionList.map((x: InquiryRegionStepResponse) => {
      if (x.stepNo == this.endStage) {
        countStep = countStep + 1;
      }
      countProportion = countProportion + x.proportion;
    })
    return countStep === this.regionList.length && countProportion === 100;
  }

  changeStage(stage: number) {
    console.log("changeStage", stage);
    this.setStepFormGroup(stage);
  }

  resetRebase() {
    this.loading.show();
    let request = new ResetRebaseRequest();
    request.indexGroup = this.indexGroup ? this.indexGroup.paramId : null;
    request.regionId = this.weightRegion && this.weightRegion.region ? this.weightRegion.region.regionId : null;
    request.provinceId = null;
    this.rebaseService.resetRebase(request).subscribe(res => {
      this.loading.hide();
      this.msgSwl.title = "ยกเลิกข้อมูลปีฐานสำเร็จ";
      this.msgSwl.show();
      this.clearSearch();
    }, error => {
      this.loading.hide();
    })
  }

}
