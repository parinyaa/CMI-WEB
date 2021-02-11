import { noWhitespaceValidator } from './../../../../shared/common/noWhitespaceValidator';
import { ContactAddRequest } from './../../../../shared/models/contact/request/contactaddrequest';
import { SourceCreateRequest } from './../../../../shared/models/source/request/sourceCreateRequest';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TambolSearchRequest } from './../../../../shared/models/request/tambolsearchRequest';
import { filter } from 'minimatch';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatAutocompleteTrigger } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RegionService } from 'src/app/core/service/region/region.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TambolserviceService } from 'src/app/core/service/tambol/tambolservice.service';
import { tambolSearchPostCodeRequest } from 'src/app/shared/models/tambol/request/tambolSearchPostCodeRequest';
import { SourceService } from 'src/app/core/service/source/source.service';

@Component({
  selector: 'app-dialog-source',
  templateUrl: './dialog-source.component.html',
  styleUrls: ['./dialog-source.component.scss']
})
export class DialogSourceComponent implements OnInit {
  @ViewChild('automatAutocomplete', { static: false }) movieSearchInput: ElementRef;
  @ViewChild('saveSourceSwal',{static:false}) saveSourceSwal:SwalComponent
  @ViewChild('postCodeSearchInput', { static: false }) postCodeSearchInput: ElementRef;
  @ViewChild('automatAutocomplete',{read:MatAutocompleteTrigger,static:false}) matAutocomplete:MatAutocompleteTrigger
  @ViewChild('sucessSourceSwal',{static:false}) sucessSourceSwal:SwalComponent;
  @ViewChild('errorSourceSwal',{static:false}) errorSourceSwal:SwalComponent;
  addSourceForm: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loading: NgxSpinnerService,
    private tambolSearchRequest: TambolSearchRequest,
    private tambolService: TambolserviceService,
    private _formBuilder: FormBuilder,
    private tambolSearchPostCodeRequest:tambolSearchPostCodeRequest,
    private sourceService:SourceService,
    private sourceCreateRequest:SourceCreateRequest,
    private contactAddRequest:ContactAddRequest,
    private noWhitespaceValidator:noWhitespaceValidator
  ) {}
  options: any;
  filteredOptions: Observable<any>;
  myControl = new FormControl();
  filteredOptionSurvey: Observable<any>;
  myControlSurvey = new FormControl();
  searchLoading = false;
  provinceCode:string;
  amphurCode:string;
  tambolCode:string;
  amphurId:number;
  tambolId:number;
  provinceId:number;
  
  ngOnInit() {
    this.setFormGroup();
   
  }

  ngAfterViewInit() {
    // this.formEvetPostCode();
    this.formEventAddress();
  }

  setFormGroup(){
    this.addSourceForm = this._formBuilder.group({
      sourceName:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      sourceAddr:['',Validators.required],
      address:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      sourcePostCode:[''],
      surveyTaxNo:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      distribution: [''],
      export: [''],
      oem: [''],
      contact: this._formBuilder.array([]),
    })
    const contact = this.addSourceForm.controls['contact'] as FormArray;
    contact.push(this._formBuilder.group({
      surveyContactName: [''],
      surveyContactPhone: [''],
      surveyContactFaxNo: [''],
      surveyContactMobileNo: [''],
      surveyContactEmail: [''],
    }));
  }

  get contactForms() {
    return this.addSourceForm.get('contact') as FormArray
  }

  addContact() {
    const contact = this.addSourceForm.controls['contact'] as FormArray;
    contact.push(this._formBuilder.group({
      surveyContactName: [''],
      surveyContactPhone: [''],
      surveyContactFaxNo: [''],
      surveyContactMobileNo: [''],
      surveyContactEmail: ['']
    }));
  }

  removeGroup(i: number) {
    const control = <FormArray>this.addSourceForm.controls['contact'];
    control.removeAt(i);
  }

  testKeyUp(value) {
    // console.log(value);
    // this.getTambolByKeyword(value)
  }

  filterTambol() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }


  displayFn(user: any): string | undefined {
    return user ? user.addrName : undefined;
  }

  private _filter(name: string): any {
    const filterValue = name;
    return this.options.filter(option => option.addrName.indexOf(filterValue) != -1);
  }

  displayFnSurvey(user: any): string | undefined {
    return user ? user.surveyCode + " " + user.surveyName : undefined;
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }

  onSelectAddr(e) {
    this.provinceCode = e.source.value.provinceCode;
    this.amphurCode = e.source.value.amphurCode;
    this.tambolCode = e.source.value.tambolCode;
    this.provinceId = e.source.value.provinceId;
    this.amphurId = e.source.value.amphurId;
    this.tambolId = e.source.value.tambolId;

    console.log(this.provinceCode+" "+this.amphurCode+" "+this.tambolCode);
    console.log('res amphurid',this.provinceId+" "+this.amphurId+" "+this.tambolId)
    this.addSourceForm.controls['sourcePostCode'].setValue(e.source.value.postCode);
  }

  get f(){ return this.addSourceForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.addSourceForm.invalid){
      return;
    }else{
     this.saveSourceSwal.show();
    }
  }

  // formEvetPostCode(){
  //   fromEvent(this.postCodeSearchInput.nativeElement, 'keyup').pipe(
  //     map((event: any) => {
  //       this.searchLoading = true;
  //       return event.target.value;
  //     }),
  //     debounceTime(1000),
  //     distinctUntilChanged()
  //   ).subscribe((text: string) => {
  //     console.log(text);
  //     this.tambolSearchPostCodeRequest.postcode = text;
  //     this.tambolService.getAddressByPostCode(this.tambolSearchPostCodeRequest).subscribe(
  //       (res) => {  
  //         this.options = res;
  //         this.matAutocomplete.openPanel();
  //         console.log(res);
  //         this.searchLoading = false;
  //       },
  //       (error) => {
  //         this.options = [];
  //         this.searchLoading = false;
  //       }
  //     )
  //   }
  //   )
  // }

  formEventAddress(){
    fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.searchLoading = true;
        return event.target.value;
      }),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      var arr = text.split(" ");
      this.tambolSearchRequest.provinceName = arr[0]!=undefined?arr[0]:"";
      this.tambolSearchRequest.amphurName = arr[1]!=undefined?arr[1]:"";
      this.tambolSearchRequest.tambolName = arr[2]!=undefined?arr[2]:"";
      console.log('res',this.tambolSearchRequest);
      console.log('res data2',this.data);
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

  createSource(){
    this.loading.show();
    
    this.sourceCreateRequest.sourceName = this.addSourceForm.controls['sourceName'].value;
    // this.sourceCreateRequest.surveyCode = this.data.surveyCode;
    // this.sourceCreateRequest.postcode = this.addSourceForm.controls['sourcePostCode'].value;
    this.sourceCreateRequest.address = this.addSourceForm.controls['address'].value;
    this.sourceCreateRequest.taxId = this.addSourceForm.controls['surveyTaxNo'].value;
    this.sourceCreateRequest.provinceCode = this.provinceCode;
    this.sourceCreateRequest.amphurCode = this.amphurCode;
    this.sourceCreateRequest.tambolCode = this.tambolCode;
    this.sourceCreateRequest.provinceId = this.provinceId;
    this.sourceCreateRequest.amphurId = this.amphurId;
    this.sourceCreateRequest.tambolId = this.tambolId;
    console.log('this data',this.sourceCreateRequest.provinceId)
    
    // this.sourceCreateRequest.contacts = [];
    this.addSourceForm.controls['contact'].value.forEach(element => {
        // this.contactAddRequest = new ContactAddRequest();
        // this.contactAddRequest.contactName = element.surveyContactName;
        // this.contactAddRequest.faxNo = element.surveyContactFaxNo;
        // this.contactAddRequest.telephoneNo = element.surveyContactPhone;
        // this.contactAddRequest.mobileNo = element.surveyContactMobileNo;
        // this.contactAddRequest.email = element.surveyContactEmail;
        // this.sourceCreateRequest.contacts.push(this.contactAddRequest);
      });
      console.log(this.sourceCreateRequest);
    this.sourceService.createSource(this.sourceCreateRequest).subscribe(
      (res) =>{
        console.log('log res data',res)
        this.loading.hide();
        this.sucessSourceSwal.show();
      },
      (error) => {
        console.log(error);
        this.errorSourceSwal.text = error.error.messageEn;
        this.errorSourceSwal.title = error.error.messageTh;
        this.loading.hide();
        this.errorSourceSwal.show();
      }
    )
  }
}
