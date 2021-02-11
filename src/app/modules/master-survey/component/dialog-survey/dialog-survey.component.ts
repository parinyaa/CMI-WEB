import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { SourceCreateDefaultRequest } from './../../../../shared/models/source/request/sourceCreateDefaultRequest';
import { SourceService } from './../../../../core/service/source/source.service';
import { tambolSearchPostCodeRequest } from './../../../../shared/models/tambol/request/tambolSearchPostCodeRequest';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SurveyPageableRequest } from './../../../../shared/models/survey/request/surveypageablerequest';
import { SurveyService } from './../../../../core/service/survey/survey.service';
import { ContactAddRequest } from './../../../../shared/models/contact/request/contactaddrequest';
import { TambolSearchRequest } from './../../../../shared/models/request/tambolsearchRequest';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TambolserviceService } from 'src/app/core/service/tambol/tambolservice.service';
import { SurveyAddRequest } from 'src/app/shared/models/survey/request/surveyaddrequest';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any;
@Component({
  selector: 'app-dialog-survey',
  templateUrl: './dialog-survey.component.html',
  styleUrls: ['./dialog-survey.component.scss']
})
export class DialogSurveyComponent implements OnInit {
  @ViewChild('automatAutocomplete', { static: false }) movieSearchInput: ElementRef;
  @ViewChild('postCodeSearchInput', { static: false }) postCodeSearchInput: ElementRef;
  @ViewChild('saveSurveySwal',{static:false}) saveSurveySwal:SwalComponent;
  @ViewChild('successSurveySwal',{static:false}) successSurveySwal:SwalComponent;
  @ViewChild('saveDefaultSourceSwal',{static:false}) saveDefaultSourceSwal:SwalComponent;
  @ViewChild('errorSurveySwal',{static:false}) errorSurveySwal:SwalComponent
  @ViewChild('successSourceSwal',{static:false}) successSourceSwal:SwalComponent
  @ViewChild("automatAutocomplete",{ read: MatAutocompleteTrigger ,static:true }) matAutocomplete:MatAutocompleteTrigger
  addSurveyForm: FormGroup;
  submitted = false;
  searchLoading = false;
  provinceCode:string;
  amphurCode:string;
  tambolCode:string;
  surveyCode:string;
  options = [];
  constructor(
    public dialogRef: MatDialogRef<DialogSurveyComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuiler: FormBuilder,
    private tambolSearchRequest: TambolSearchRequest,
    private tambolService: TambolserviceService,
    private surveyAddRequest:SurveyAddRequest,
    private contactAddrequest:ContactAddRequest,
    private surveyService:SurveyService,
    private loading:NgxSpinnerService,
    private tambolSearchPostCodeRequest:tambolSearchPostCodeRequest,
    private sourceService:SourceService,
    private sourceCreateDefaultRequest:SourceCreateDefaultRequest,
    private noWhitespaceValidator:noWhitespaceValidator
  ) {}

  ngOnInit() {
    this.setFormGroup();
  }

  ngAfterViewInit() {
    fromEvent(this.movieSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.searchLoading = true;
        return event.target.value;
      }),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
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
    this.formEvetPostCode();
  }

  displayFn(user: any): string | undefined {
    return user ? user.addrName : undefined;
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }

  createSurvey(){
    this.surveyAddRequest.surveyName = this.addSurveyForm.controls['surveyName'].value;
    this.surveyAddRequest.taxId = this.addSurveyForm.controls['surveyTaxNo'].value;
    this.surveyAddRequest.postCode = this.addSurveyForm.controls['surveyPostCode'].value;
    this.surveyAddRequest.provinceCode = this.provinceCode;
    this.surveyAddRequest.amphurCode = this.amphurCode;
    this.surveyAddRequest.tambolCode = this.tambolCode;
    this.surveyAddRequest.address = this.addSurveyForm.controls['surveyAddress1'].value;
    this.surveyAddRequest.contacts = [];
    this.addSurveyForm.controls['contact'].value.forEach(element => {
    this.contactAddrequest = new ContactAddRequest();
    this.contactAddrequest.contactName = element.surveyContactName;
    this.contactAddrequest.faxNo = element.surveyContactFaxNo;
    this.contactAddrequest.telephoneNo = element.surveyContactPhone;
    this.contactAddrequest.mobileNo = element.surveyContactMobileNo;
    this.contactAddrequest.email = element.surveyContactEmail;
    this.surveyAddRequest.contacts.push(this.contactAddrequest);
    });
    this.onCreateSurvey(this.surveyAddRequest);
  }

  onCreateSurvey(request){
    this.loading.show();
    this.surveyService.createSurvey(request)
    .subscribe(
      (res) => {
        this.surveyCode = res;
        this.saveDefaultSourceSwal.show();
        this.loading.hide();
      },
      (error) => {
        this.errorSurveySwal.text = error.error.messageEn;
        this.errorSurveySwal.title = error.error.messageTh;
        this.loading.hide();
        this.errorSurveySwal.show();
      }
    )

  }


  get f() { return this.addSurveyForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addSurveyForm.invalid) {
      return;
    } else {
      this.saveSurveySwal.show();
    }
  }

  onSelectAddr(e) {
    this.provinceCode = e.source.value.provinceCode;
    this.amphurCode = e.source.value.amphurCode;
    this.tambolCode = e.source.value.tambolCode;
    console.log(this.provinceCode+" "+this.amphurCode+" "+this.tambolCode);
    this.addSurveyForm.controls['surveyPostCode'].setValue(e.source.value.postCode);
  }

  setFormGroup(){
    this.addSurveyForm = this._formBuiler.group({
      surveyName: ['', Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyAddr: ['', Validators.required],
      surveyPostCode: ['', Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyTaxNo: ['', Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyAddress1: ['', Validators.required,this.noWhitespaceValidator.noWhitespace],
      contact: this._formBuiler.array([]),
    });
    const contact = this.addSurveyForm.controls['contact'] as FormArray;
    contact.push(this._formBuiler.group({
      surveyContactName: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyContactPhone: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyContactFaxNo: [''],
      surveyContactMobileNo: [''],
      surveyContactEmail: [''],
    }));
  }

  get contactForms() {
    return this.addSurveyForm.get('contact') as FormArray
  }

  addContact() {
    const contact = this.addSurveyForm.controls['contact'] as FormArray;
    contact.push(this._formBuiler.group({
      surveyContactName: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyContactPhone: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyContactFaxNo: [''],
      surveyContactMobileNo: [''],
      surveyContactEmail: ['']
    }));
  }

  removeGroup(i: number) {
    const control = <FormArray>this.addSurveyForm.controls['contact'];
    control.removeAt(i);
  }


  getAddressByPostCode(postCode){

  }

  formEvetPostCode(){
    fromEvent(this.postCodeSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.searchLoading = true;
        return event.target.value;
      }),
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      console.log(text);
      this.tambolSearchPostCodeRequest.postcode = text;
      this.tambolService.getAddressByPostCode(this.tambolSearchPostCodeRequest).subscribe(
        (res) => {  
          this.options = res;
          this.matAutocomplete.openPanel();
          console.log(res);
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

  addDefaultSource(){
    this.saveDefaultSourceSwal.show();
  }

  createDefaultSource(){
    this.loading.show();
    console.log( this.surveyCode);
    this.sourceService.createSourceDefault(this.surveyCode).subscribe(
      (res) => {
        this.loading.hide();
        this.successSourceSwal.show();
      },
      (error) => {
        this.errorSurveySwal.text = error.error.messageEn;
        this.errorSurveySwal.title = error.error.messageTh;
        this.errorSurveySwal.show();
        this.loading.hide();
      }
    )
    
  }

}