import { ContactService } from './../../../core/service/contact/contact.service';
import { ContactDeletedRequest } from './../../../shared/models/contact/request/contactDeletedRequest';
import { ProvinceService } from './../../../core/service/province/province.service';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { TambolserviceService } from 'src/app/core/service/tambol/tambolservice.service';
import { TambolSearchRequest } from 'src/app/shared/models/request/tambolsearchRequest';
import { DataConfigComponent } from './../component/data-config/data-config.component';
import { SourceService } from './../../../core/service/source/source.service';
import { SurveyEditRequest } from './../../../shared/models/survey/request/surveyEditRequest';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogSourceComponent } from './../../master-source/component/dialog-source/dialog-source.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatTableDataSource, MatDialog, MatSort, Sort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { SourcePageableRequest } from 'src/app/shared/models/source/request/sourcepageablerequest';
import { DialogEditsourceComponent } from '../../master-source/component/dialog-editsource/dialog-editsource.component';
import { Router } from '@angular/router';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ParamInfo } from '../../master-params/model/param';
import { Amphur, Province } from '../../keyin-data/model/neighborhoodResponse';
import { RegionService } from 'src/app/core/service/region/region.service';
import { SourceAllReqest, SourceAllResponse } from 'src/app/shared/models/source/request/sourceAllRequestModel';
declare var $: any;
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  @ViewChild('automatAutocomplete', { static: false }) provinceSearchInput: ElementRef;
  @ViewChild('deleteSwal', { static: false }) deleteSwal: SwalComponent;
  @ViewChild('deleteSwalSuccess', { static: false }) deleteSwalSuccess: SwalComponent;
  @ViewChild('updataSurvey', { static: false }) updataSurvey: SwalComponent;
  @ViewChild('saveSwalSuccess', { static: false }) saveSwalSuccess: SwalComponent;
  @ViewChild('deleteSourceSwal', { static: false }) deleteSourceSwal: SwalComponent;
  @ViewChild("DataConfigComponent", { static: false }) dataConfigComponent: DataConfigComponent;
  @ViewChild(MatSort, { static: false }) set conent(sort: MatSort) { this.dataSurvey.sort = sort; }
  @ViewChild(MatSort, { static: false }) set content2(sort2: MatSort) { this.dataSource.sort = sort2; }
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  contactColumns: string[] = ['contactName', 'contactPhone', 'contactFax', 'contactMobile', 'contactEmail', 'action'];
  displayedColumns: string[] = ['surveyCode', 'surveyName', 'surveyAddr', 'surveyContactName', 'surveyContactDetail', 'view', 'deleted'];
  displayedColumnsSource: string[] = ['sourceCode', 'sourceName', 'taxId', 'address', 'tambol', 'amphur', 'province', 'countCpa', 'edit', 'delete'];
  dataSource = new MatTableDataSource();
  dataSurvey = new MatTableDataSource();
  dataContact = new MatTableDataSource();
  txtSurveyName = "ข้อมูลแหล่งข้อมูล";
  txtSurveyCode = "(Source)";
  searchLoading = false;
  configShow = false;
  pageSize = 10;
  page = 1;
  pageSizeSource = 10;
  data: any;
  pageSource = 1;
  options: any;
  filteredOptions: Observable<any>;
  myControl = new FormControl();
  tabSettingSurvey = false;
  displaySurvey = true;
  editSurvey: FormGroup;
  totalRecords: number;
  totalRecordsSource: number;
  surveyCodeActive: string;
  sourceCodeActive: string;
  sourceParent: any;
  amphurId: number;
  tambolId: number;
  provinceId: number;
  btnSaveSurvey = true;
  submitted = false;
  surveyEditActice: any;
  provinceAll = new Array();
  contactActive = new Array();
  searchFilter = { province : new Province(),amphur: new Amphur(), sourceCode: new SourceAllResponse(), sourceName: new SourceAllResponse() };
  filterProvinceOptions: Observable<any[]>;
  filterProvinceControl = new FormControl();
  filterAmphurOptions: Observable<any[]>;
  filterAmphurControl = new FormControl();
  filterSourceOptions: Observable<any[]>;
  filterSourceControl = new FormControl();
  filterSourceNameOptions: Observable<any[]>;
  filterSourceNameControl = new FormControl();
  tabActive: number = 0;
  userProfile: any;
  listUserProfile: any;
  amphur = new Array();
  soruceCodeList = new Array();
  soruceNameList = new Array();

  constructor(
    private loading: NgxSpinnerService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private surveyEditRequest: SurveyEditRequest,
    private sourceService: SourceService,
    private sourcePageableRequest: SourcePageableRequest,
    private route: Router,
    private tambolSearchRequest: TambolSearchRequest,
    private tambolService: TambolserviceService,
    private noWhitespaceValidator: noWhitespaceValidator,
    private provinceService: ProvinceService,
    private contactService: ContactService,
    private sessionService: SessionServiceService,
    private paramService: ParamService,
    private regionService: RegionService,
  ) { }

  ngOnInit() {
    this.page = 1;
    this.pageSize = this.pageSize;
    console.log('history', history);
    this.editSurvey = this._formBuilder.group({
      surveyCodeEdit: ['', Validators.required],
      surveyNameEdit: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      surveyTaxNoEdit: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      surveyPostCodeEdit: ['', Validators.required],
      surveyAddrEdit: ['', Validators.required],
      surveyAddressEdit: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      contact: this._formBuilder.array([]),
      contactAdd: this._formBuilder.array([])
    });
    // this.getAllSource();
    this.getProvinceAll();
    // this.getSourcePageable(this.page, this.pageSize);
   
  }

  get contactForms() {
    return this.editSurvey.get('contact') as FormArray
  }

  get contactAddForms() {
    return this.editSurvey.get('contactAdd') as FormArray
  }

  surveyGenContact(data) {
    let responseSurvey = [];
    let responseContact = {}
    data.forEach(element => {
      if (element.contactPersons.length > 0) {
        element.contactPersons.forEach((element2, i) => {
          console.log(i);
          if (i != 0) {
            element2.cpipMsSurvey = null;
          }
          element2.contactPersons = element.contactPersons;
          console.log(element2);
          responseSurvey.push(element2);
        });
      } else {
        element.cpipMsSurvey = element.survey;
        responseSurvey.push(element);
      }
    });
    this.dataSurvey = new MatTableDataSource(responseSurvey);
    console.log(responseSurvey);
  }

  getAllSourceName(event){  
      
    if(event.length === 3) {

      this.loading.show();

      let req = new SourceAllReqest();
      req.provinceName = this.searchFilter.province.provinceName;
      req.sourceCode = '';
      req.sourceName = event; 
      this.sourceService.getAllSource(req).subscribe(
        (res) => {
          this.soruceNameList = res;
          console.log('sourceName-all ', this.soruceNameList);
  
          this.filterSourceNameOptions = this.filterSourceNameControl.valueChanges
          .pipe(
            startWith(''),
            map(value => {
              console.log(value);
              return typeof value === 'string' ? value : value.sourceName;
            }),
            map(sourceName => {
              console.log(sourceName);
    
              return sourceName ? this._filterSourceNameList(sourceName) : this.soruceNameList.slice();
            })
          );
          this.loading.hide();
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        }
      )

    }

  }

  getAllSource(event){  
      
    if(event.length === 3) {

      this.loading.show();

      let req = new SourceAllReqest();
      req.provinceName = this.searchFilter.province.provinceName;
      req.sourceCode = event;
      req.sourceName = ''; 
      this.sourceService.getAllSource(req).subscribe(
        (res) => {
          this.soruceCodeList = res;
          console.log('source-all ', this.soruceCodeList);
  
          this.filterSourceOptions = this.filterSourceControl.valueChanges
          .pipe(
            startWith(''),
            map(value => {
              console.log(value);
              return typeof value === 'string' ? value : value.sourceCode;
            }),
            map(sourceCode => {
              console.log(sourceCode);
    
              return sourceCode ? this._filterSourceCodeList(sourceCode) : this.soruceCodeList.slice();
            })
          );
          this.loading.hide();
        },
        (error) => {
          console.log(error);
          this.loading.hide();
        }
      )

    }

  }

  getSourcePageable(page, pageSize) { ///*get source*/
    this.loading.show();
    // var sortList = new Array<SortedList>();
    // this.pageable.page = page;
    // this.pageable.size = pageSize;
    // this.sortedList.field = "string";
    // this.sortedList.direction = "ASC";
    // sortList.push(this.sortedList);
    // this.pageable.sortedList = sortList;
    // this.sourcePageableRequest.pageable = this.pageable;
    // var sortList = new Array<SortedList>();
    this.sourcePageableRequest.direction = "ASC";
    this.sourcePageableRequest.page = page;
    this.page = page;
    this.sourcePageableRequest.size = pageSize;
    this.pageSize = pageSize;
    this.sourcePageableRequest.provinceName = this.searchFilter.province.provinceName;
    this.sourcePageableRequest.amphurName = this.searchFilter.amphur.amphurName;
    this.sourcePageableRequest.sourceCode = this.searchFilter.sourceCode.sourceCode;
    this.sourcePageableRequest.sourceName = this.searchFilter.sourceName.sourceName;
    // this.sourcePageableRequest.sourceCode = this.sourceCodeActive;
    this.sourceService.getSourceInquiry(this.sourcePageableRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.dataSource = new MatTableDataSource(res.data);
        this.totalRecordsSource = res.totalRecords;
        console.log('log res', res);
      },
      (error) => {
        console.log(error);
        this.dataSource = new MatTableDataSource(null);
        this.loading.hide();
      }
    )
  }

  displayFn(province: Province): string  {
    console.log('province === ',province);
    
    if(province !== undefined && province !== null && JSON.stringify(province) !== '{}') {
      return province ? province.provinceCode + ' ' +  province.provinceName : '';
    }
    
    // return province ? province.provinceCode + ' ' +  province.provinceName : '';
  }

  displayFnAmphur(amphur: Amphur): string  {
    console.log('amphur === ',amphur);
    
    if(amphur !== undefined && amphur !== null  && JSON.stringify(amphur) !== '{}') {
      return amphur ? amphur.amphurName : '';
    }
    
  }

  displayFnSourceCode(sourceCode: SourceAllResponse): string  {
    console.log('sourceCode === ',sourceCode);
    
    if(sourceCode !== undefined && sourceCode !== null  && JSON.stringify(sourceCode) !== '{}') {
      return sourceCode ? sourceCode.sourceCode : '';
    }
    
  }

  displayFnSourceName(sourceName: SourceAllResponse): string  {
    console.log('sourceCode === ',sourceName);
    
    if(sourceName !== undefined && sourceName !== null  && JSON.stringify(sourceName) !== '{}') {
      return sourceName ? sourceName.sourceName : '';
    }
    
  }

  private _filter(name: string): any {
    console.log(name);
    const filterValue = name.toLowerCase();
    // return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  applyFilter(filterValue: string) {
    this.dataSurvey.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSurvey);
  }

  clearContactAdd() {
    const contactadd = this.editSurvey.controls['contactAdd'] as FormArray;
    contactadd.clear();
  }

  closeTabs() {
    this.tabSettingSurvey = false;
    this.displaySurvey = true;
    this.btnSaveSurvey = true;
    this.route.navigate([{ outlets: { dataconfig: null } }])
      .then(() => this.route.navigate(['survey']));
    this.txtSurveyName = "ข้อมูลแหล่งข้อมูล";
    this.txtSurveyCode = "(Source)";
    this.tabActive = 0;
    this.ngOnInit();
  }

  setInputOnEdit(data: any) {
    const contact = this.editSurvey.controls['contact'] as FormArray;
    contact.clear();
    for (var i = 0; i < data.contactPersons.length; i++) {
      contact.push(this._formBuilder.group({
        surveyContactNameEdit: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
        surveyContactPhoneEdit: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
        surveyContactFaxNoEdit: [''],
        surveyContactMobileNoEdit: [''],
        surveyContactEmailEdit: [''],
      }));
    }
    this.contactActive = data.contactPersons;
    this.dataContact = new MatTableDataSource(data.contactPersons);
    this.surveyEditRequest.address = data.cpipMsSurvey.address;
    this.surveyEditRequest.amphurCode = data.cpipMsSurvey.cpipMsAmphur ? data.cpipMsSurvey.cpipMsAmphur.amphurCode : null
    this.surveyEditRequest.postCode = data.cpipMsSurvey.postcode
    this.surveyEditRequest.provinceCode = data.cpipMsSurvey.cpipMsProvince ? data.cpipMsSurvey.cpipMsProvince.provinceCode : null
    this.surveyEditRequest.surveyCode = data.cpipMsSurvey.surveyCode;
    this.surveyEditRequest.taxId = data.cpipMsSurvey.taxId;
    this.surveyEditRequest.tambolCode = data.cpipMsSurvey.cpipMsTambol ? data.cpipMsSurvey.cpipMsTambol.tambolCode : null;
    this.editSurvey.controls['surveyCodeEdit'].setValue(data.cpipMsSurvey.surveyCode);
    this.editSurvey.controls['surveyNameEdit'].setValue(data.cpipMsSurvey.surveyName);
    this.editSurvey.controls['surveyTaxNoEdit'].setValue(data.cpipMsSurvey.taxId);
    this.editSurvey.controls['surveyPostCodeEdit'].setValue(data.cpipMsSurvey.postcode);
    let addrStr = data.cpipMsSurvey.cpipMsProvince ? data.cpipMsSurvey.cpipMsProvince.provinceName : "" + " " + data.cpipMsSurvey.cpipMsAmphur ? data.cpipMsSurvey.cpipMsAmphur.amphurName : "" + " " + data.cpipMsSurvey.cpipMsTambol ? data.cpipMsSurvey.cpipMsTambol.tambolName : "";
    this.editSurvey.controls['surveyAddrEdit'].setValue(addrStr);
    this.editSurvey.controls['surveyAddressEdit'].setValue(data.cpipMsSurvey.address);
  }

  getUserProfile() {
    this.userProfile = this.sessionService.getUserProfile();
    console.log('userProfile === ',this.userProfile);
    
    if (this.userProfile.provinceId !== null) {
      this.listUserProfile = this.userProfile.provinceId;
      console.log('listUserProfile === ',this.listUserProfile);


      this.filterProvinceControl.setValue(this._filterProvinceList(this.userProfile.localFirstName)[0]);
      // this.cpaPageableRequset.provinceName =this.searchObj.provinceName;
      // this.cpaPageableRequset.provinceName = this.filterProvinceControl.value.provinceName;
      this.searchFilter.province = this.filterProvinceControl.value.provinceName;
      
      this.filterProvinceControl.disable();
      
      
      // this.checkProvinceId = true;
    } else {
      this.listUserProfile = 0;
      this.filterProvinceControl.setValue(JSON.stringify(this.filterProvinceControl.value) !== '{}' ? this.filterProvinceControl.value :this.provinceAll.find((x => x.provinceName === 'กรุงเทพมหานคร')));
      this.searchFilter.province = this.filterProvinceControl.value ? this.filterProvinceControl.value : '';
      this.getAmphur(this.searchFilter.province.provinceId);
      // this.getAllSource();
      
    }
  }

  editProvinceAutoComplete() {
    fromEvent(this.provinceSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.searchLoading = true;
        return event.target.value;
      }),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      console.log(text);
      var arr = text.split(" ");
      this.tambolSearchRequest.provinceName = arr[0] != undefined ? arr[0] : "";
      this.tambolSearchRequest.amphurName = arr[1] != undefined ? arr[1] : "";
      this.tambolSearchRequest.tambolName = arr[2] != undefined ? arr[2] : "";
      this.tambolService.searchTambol(this.tambolSearchRequest)
        .subscribe(
          (res) => {
            this.options = res;
            this.searchLoading = false;
          },
          (error) => {
            this.options = [];
            this.searchLoading = false;
          }
        )
    }
    )
  }

  openDialogSource(): void {
    const dialogRef = this.dialog.open(DialogSourceComponent, {
      width: '80%',
      height: '70%',
      data: { "provinceId": this.provinceId, "amphurId": this.amphurId, "tambolId": this.tambolId },
      position: {
        top: '10%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSourcePageable(this.pageSource, this.pageSizeSource);
      }
    });
  }

  detailSurvey(data: any) {
    console.log('data codeeee', data.source.sourceCode);
    
    this.data = data;
    this.configShow = true;
    this.displaySurvey = false;
    this.btnSaveSurvey = false;
    this.tabSettingSurvey = true;
    this.txtSurveyName = data.source.sourceName;
    this.txtSurveyCode = "";
    this.sourceCodeActive = this.data && this.data.source ? this.data.source.sourceCode : null;
    this.sourceParent = this.data && this.data.source ? this.data.source : null;
  }

  openDialogEditSource(source): void {
    const dialogRef = this.dialog.open(DialogEditsourceComponent, {
      width: '80%',
      height: '90%',
      data: source,
      position: {
        top: '2%',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("--------------");
      if (result) {
        this.getSourcePageable(this.pageSource, this.pageSizeSource);
      }
    });
  }


  deleteSource(source) {
    this.loading.show();
    this.sourceService.deleteSource(source.source.sourceCode).subscribe(
      (res) => {
        this.loading.hide();
        this.getSourcePageable(this.pageSource, this.pageSizeSource);
        this.deleteSwalSuccess.show();
      },
      (error) => {
        console.log(error);
        this.loading.hide();
      }
    )
  }


  updatePaginationSource(event) {
    this.pageSource = event.pageIndex + 1;
    this.pageSizeSource = event.pageSize;
    this.getSourcePageable(this.pageSource, this.pageSizeSource);
  }

  selectedTabChange(e) {
    console.log('kkkk ===',this.filterProvinceControl.value);
    
    console.log(e);
    this.clearContactAdd();
    this.tabActive = e.index;
    if (e.index == 1) {
      console.log("sourceCode", this.sourceCodeActive);
    }
    else {
      this.dataSource = new MatTableDataSource([]);
      this.route.navigateByUrl("survey");
    }
  }

  get f() { return this.editSurvey.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editSurvey.invalid) {
      return;
    } else {
      this.updataSurvey.show();
    }
  }

  getProvinceAll() {
    this.loading.show();
    this.provinceService.getProvinceAll().subscribe(
      (res) => {
        this.loading.hide();
        this.provinceAll = res;
        
        this.filterProvinceOptions = this.filterProvinceControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            console.log(value);
            return typeof value === 'string' ? value : value.provinceName;
          }),
          map(provinceName => {
            console.log(provinceName);
  
            return provinceName ? this._filterProvinceList(provinceName) : this.provinceAll.slice();
          })
        );

        this.getUserProfile();
        this.getSourcePageable(this.page, this.pageSize);
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }
  selectedPorvice(event) {
    if (this.filterProvinceControl.value) {
      this.searchFilter.amphur =  new Amphur();
      this.getAmphur(this.filterProvinceControl.value.provinceId);
    }

  }

  getAmphur(provinceId) {
    console.log('ssss === ',provinceId);
    
    this.loading.show();
    this.regionService.getAmphur(provinceId)
      .subscribe(
        res => {
          this.amphur = res;
          console.log(this.amphur );

          this.filterAmphurOptions = this.filterAmphurControl.valueChanges
          .pipe(
            startWith(''),
            map(value => {
              console.log(value);
              return typeof value === 'string' ? value : value.amphurName;
            }),
            map(amphurName => {
              console.log(amphurName);
    
              return amphurName ? this._filterAmphurList(amphurName) : this.amphur.slice();
            })
          );
          
          this.loading.hide();
        },
        error => {
          this.amphur = [];
          this.loading.hide();
        }
      )
  }

  onSearch() {
    console.log("searchFilter", this.searchFilter);
    this.getSourcePageable(1, this.pageSize);
  }

  onSortData(sort: Sort) {
    this.dataSurvey.sortingDataAccessor = (item, property) => {
      console.log("sortingDataAccessor", property);
      switch (property) {
        case 'surveyCode': {
          console.log("item", item);
          return item['cpipMsSurvey'] != null ? item['cpipMsSurvey'].surveyCode : "";
        }
        case 'surveyName': {
          return item['cpipMsSurvey'] != null ? item['cpipMsSurvey'].surveyName : "";
        }
        case 'surveyAddr': {
          return item['cpipMsSurvey'] != null ? item['cpipMsSurvey'].address : "";
        }
        case 'surveyContactName': {
          return item['contactName'];
        }
        case 'surveyContactDetail': {
          return item['contactPersons'][0].telephoneNo;
        }
        default: return item[property];
      }
    };
  }

  onSortDataSource(sort: Sort) {
    this.dataSource.sortingDataAccessor

      = (item, property) => {
        console.log(property);
        switch (property) {
          case 'sourceCode': {
            return item['source'].sourceCode;
          } case 'sourceName': {
            return item['source'].sourceName;
          } case 'countCpa': {
            return item['countCap'];
          }
          default: return item[property];
        }
      };
  }

  addContact() {
    const contact = this.editSurvey.controls['contactAdd'] as FormArray;
    contact.push(this._formBuilder.group({
      surveyContactNameAdd: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      surveyContactPhoneAdd: ['', Validators.required, this.noWhitespaceValidator.noWhitespace],
      surveyContactFaxNoAdd: [''],
      surveyContactMobileNoAdd: [''],
      surveyContactEmailAdd: [''],
    }));
  }

  removeGroup(i: number) {
    const control = <FormArray>this.editSurvey.controls['contactAdd'];
    control.removeAt(i);
  }

  removeContact(contact, i) {
    this.loading.show();
    let contactDeletedRequest = new ContactDeletedRequest();
    contactDeletedRequest.contactPersonId = contact.contactPersonId;
    this.contactService.deleteContact(contactDeletedRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.contactActive.splice(i, 1);
        this.dataContact = new MatTableDataSource(this.contactActive);
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  private _filterProvinceList(name: string): any[] {

    let selectProvince :any;
    const filterValue = name;
      selectProvince = this.provinceAll.filter(option =>

        option.provinceName.toString().startsWith(filterValue) || option.provinceCode.toString().startsWith(filterValue) 
      )

    return selectProvince;
  }

  private _filterAmphurList(amphur: string): any[] {

    let selectAmphur :any;
    const filterValue = amphur;
      selectAmphur = this.amphur.filter(option =>

        option.amphurName.toString().startsWith(filterValue)
      )

    return selectAmphur;
  }

  private _filterSourceCodeList(sourceCode: string): any[] {

    let selectSource :any;
    const filterValue = sourceCode;
    selectSource = this.soruceCodeList.filter(option =>

        option.sourceCode.toString().startsWith(filterValue)
      )

    return selectSource;
  }

  private _filterSourceNameList(sourceName: string): any[] {

    let selectSource :any;
    const filterValue = sourceName;
    selectSource = this.soruceNameList.filter(option =>

        option.sourceName.toString().startsWith(filterValue)
      )

    return selectSource;
  }

  
  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }


}
