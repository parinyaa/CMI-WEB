import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BaseyearService } from 'src/app/core/service/baseyear/baseyear.service';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { IndexMatrixService } from 'src/app/core/service/indexmatrix/index-matrix.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ProvinceService } from 'src/app/core/service/province/province.service';
import { DisabledModel, IndexCpipResponseModel, IndexGroupResponseModel, ProvinceResponseModel, RegionResponseMode } from '../../models/index-matrix/CpipMsIndexMatrixRequestForm';

@Component({
  selector: 'app-filter-index-group',
  templateUrl: './filter-index-group.component.html',
  styleUrls: ['./filter-index-group.component.scss']
})
export class FilterIndexGroupComponent implements OnInit {

  @Output() indexCpip = new EventEmitter<IndexCpipResponseModel>();
  filterProvinceOptions: Observable<ProvinceResponseModel[]>;
  filterProvinceControl = new FormControl();
  filterRegionOptions: Observable<RegionResponseMode[]>;
  filterRegionControl = new FormControl();
  filterIndexGroupOptions: Observable<IndexGroupResponseModel[]>;
  filterIndexGroupControl = new FormControl();
  listIndexGroup: Array<IndexGroupResponseModel>
  listProvinceData: Array<ProvinceResponseModel>;
  listRegion: Array<RegionResponseMode>;
  isNewWeightThailand: boolean = false;
  showProvince: boolean  = false;
  showRegion: boolean = false;
  userProfile: any;
  baseYear: any;
  group;
  showBtnSearch: boolean;
  checkdDisabled: boolean;
  setValueUserProvince: boolean = false;
  @Output() clearPage = new EventEmitter<boolean>();
  // clearPage: boolean = true;
  @Input() set checkDisabledInput(checkDisabledInput: DisabledModel) {

    console.log('checkDisabledInput ========= ',checkDisabledInput);
    
    if (checkDisabledInput) {
  
      if(checkDisabledInput.searchActive) {
        this.filterIndexGroupControl.disable();
        this.filterProvinceControl.value  !== null ? this.filterProvinceControl.disable(): this.filterRegionControl.disable();
        this.showBtnSearch = false;
        this.checkdDisabled = true
      } else {
        this.filterIndexGroupControl.enable();
        this.filterProvinceControl ? this.filterProvinceControl.enable(): this.filterRegionControl.enable();
        this.showBtnSearch = true;
        this.checkdDisabled = false;
      }
    }

  }

  constructor(private indexMatrixService: IndexMatrixService,
    private paramService: ParamService,
    private sessionService: SessionServiceService,
    private baseYearService: BaseyearService,
    private provinceService: ProvinceService,) { }

  ngOnInit() {
    this.getIndexGroup('INDEX_GROUP');

    // this.filterProvinceOptions = this.filterProvinceControl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => {
    //     console.log(value);


    //     return value ? this._filterProvinceList(value) : this.listProvinceData.slice();
    //   })
    // );

  this.filterRegionOptions = this.filterRegionControl.valueChanges
    .pipe(
      startWith(''),
      map(value => {
        console.log(value);


        return value ? this._filterRegionList(value) : this.listRegion.slice();
      })
    );

  // this.filterIndexGroupOptions = this.filterIndexGroupControl.valueChanges
  //   .pipe(
  //     startWith(''),
  //     map(value => {
  //       console.log(value);


  //       return value ? this._filterIndexGroupList(value) : this.listIndexGroup.slice();
  //     })
  //   );
  }

  displayFilterProvince(province?: ProvinceResponseModel): string | undefined {
    console.log('displayFilterProvince === ', province);

    return province ? province.provinceCode + ' ' +  province.provinceName : undefined;
  }

  displayFilterRegion(region?: RegionResponseMode): string | undefined {
    return region ? region.regionName : undefined;
  }

  displayFilterIndexGroup(indexGroup?: IndexGroupResponseModel): string | undefined {
    console.log('indexGroup', indexGroup);

    return indexGroup ? indexGroup.paramInfo : undefined;
  }

  private _filterProvinceList(province: string): any[] {
    const filterValue = province


    let selectProvince = this.listProvinceData.filter(option =>

      option.provinceCode.toString().startsWith(filterValue)  || option.provinceName.toString().startsWith(filterValue) 
      )
 
    console.log('selectProvince =====> ', selectProvince);

    return selectProvince;
  }

  private _filterRegionList(region: string): any[] {
    const filterValue = region


    let selectRegion = this.listRegion.filter(option =>


      option.regionName.toString().startsWith(filterValue)
    )
    console.log('selectRegion =====> ', selectRegion);

    return selectRegion;
  }
  private _filterIndexGroupList(indexGroup: string): any[] {
    const filterValue = indexGroup
    let selectIndexGroup ;
    if(indexGroup === 'CPIP' && this.setValueUserProvince) {
      selectIndexGroup = this.listIndexGroup.find(option =>
        option.paramInfo.toString().startsWith(filterValue));
    } else {
      selectIndexGroup = this.listIndexGroup.filter(option =>
       option.paramInfo.toString().startsWith(filterValue));
    }

    return selectIndexGroup;
  }

  getIndexGroup(paramsGroup) {
    this.listIndexGroup = this.paramService.getParamByGroup(paramsGroup)

    console.log('indexGroup ==== > ', this.listIndexGroup);
    this.filterIndexGroupOptions = this.filterIndexGroupControl.valueChanges
    .pipe(
      startWith(''),
      map(value => {
        console.log(value);


        return value ? this._filterIndexGroupList(value) : this.listIndexGroup.slice();
      })
    );

      this.setProvinceData();  

  }

  onSelectRegion(e) {
    this.checkdDisabled = false;
    this.showBtnSearch = true;
  }

  getUserProfile() {
    this.userProfile = this.sessionService.getUserProfile();
    if (this.userProfile.provinceId !== null) {
      this.setValueUserProvince = true;
      this.filterIndexGroupControl.setValue(this._filterIndexGroupList('CPIP'));
      this.filterProvinceControl.setValue(this._filterProvinceList(this.userProfile.localFirstName)[0]);
      this.showProvince = true;
      this.filterProvinceControl.disable();
      this.filterIndexGroupControl.disable();
      this.showBtnSearch = true;
  } else {
    this.filterProvinceControl.setValue(this.listProvinceData.find((x => x.provinceName === 'กรุงเทพมหานคร')));

      // this.showBtnSearch = true;

  }
  }

  selectChangeIndexGroup(event) {
    let paramId = event ? event.paramId : null;
    this.group = this.listIndexGroup.find(i => i.paramId === paramId);
    this.isNewWeightThailand = false;
    if(this.group && this.group.paramInfo === 'CPIP') {
      this.showProvince  = true;
      this.showRegion = false;
      if(this.userProfile.provinceId === null && this.filterProvinceControl.value) {
        this.showBtnSearch = true;
      }
      
      
    }

      if (this.group && this.group.paramInfo != 'CPIP') {
        this.indexMatrixService.inquiryIndexMatrix(this.filterIndexGroupControl.value? this.filterIndexGroupControl.value.paramId :null).subscribe((res) => {

        console.log('res regionnn', res.regionNameList);
        if (res.regionNameList.length !== 0) {
          this.listRegion = res.regionNameList;
          console.log('this.listIndexMatrix =========== ',this.listRegion);
          
        }
        this.showProvince = false;
        this.showRegion = true;
      },
        (error) => {

        },
      );
    } else {

      console.log('isShowProvinceInput value => ', this.showProvince);
    }
  }
  


  setProvinceData() {
    let indexGroup = this.listIndexGroup.find(x => x.paramInfo === 'CPIP');
    if (indexGroup != null) {
      this.provinceService.getProvinceAll().subscribe((res) => {

        this.listProvinceData = res;
        console.log('listProvince === >', this.listProvinceData);
        this.filterProvinceOptions = this.filterProvinceControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            console.log(value);
    
    
            return value ? this._filterProvinceList(value) : this.listProvinceData.slice();
          })
        );
        this.getUserProfile();
      }, (error) => {
      });
    }

  }

  onSearch() {
    // let item = new IndexCpipResponseModel()
    const item = {
      indexGroup : this.filterIndexGroupControl.value,
      province : this.filterProvinceControl.value ? this.filterProvinceControl.value : null,
      region : this.filterRegionControl.value ? this.filterRegionControl.value : null
    };
    let disable = new DisabledModel();
    disable.checkdDisableProvince = this.showBtnSearch;
    console.log('item ====== ',item);
    
    this.indexCpip.emit(item);
    this.clearPage.emit(false);
    // this.checkdDisableProvinceInput.emit(disable);

  }

  clearSearch() {
    let checkObj = new DisabledModel();
    if (this.userProfile.provinceId !== null) {
      checkObj.searchActive = true;
      this.showRegion = false;
      this.showProvince = true;
      this.checkdDisabled = true;
      if (this.checkdDisabled == true) {
        this.filterIndexGroupControl.disable();
        this.filterProvinceControl.disable();
        this.filterRegionControl.disable();
      }
      // this.checkDisabledInput = checkObj;
      this.showBtnSearch = true;
      this.clearPage.emit(true);

    } else {
      checkObj.searchActive = false;
      this.showRegion = false;
      this.showProvince = false;
      this.filterIndexGroupControl.setValue(new FormControl());
      this.filterRegionControl.setValue(new FormControl());
      this.filterProvinceControl.setValue(new FormControl());
      // this.checkDisabledInput = checkObj;
      this.checkdDisabled = false;
      this.clearPage.emit(true);
      if (this.checkdDisabled == false) {
        this.filterIndexGroupControl.enable();
        this.filterProvinceControl.enable();
        this.filterRegionControl.enable();
      }
    }
    this.getIndexGroup('INDEX_GROUP');
  }


  getMaxBaseYear() {
    this.baseYearService.getMaxBaseYear().subscribe(
      (res) => {
        this.baseYear = res.baseYear;
        console.log(this.baseYear)
      },
      (error) => {
        console.log(error);
      });
  }

}
