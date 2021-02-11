import { StakeholderEditRequest } from './../../../../shared/models/stakeholder/request/stakeholderEditRequest';
import { StakeholderService } from './../../../../core/service/stakeholder/stakeholder.service';
import { StakeholderAddRequest } from './../../../../shared/models/stakeholder/request/stakeholderaddrequest';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteTrigger } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { Observable, fromEvent } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TambolserviceService } from 'src/app/core/service/tambol/tambolservice.service';
import { TambolSearchRequest } from './../../../../shared/models/request/tambolsearchRequest';
import { tambolSearchPostCodeRequest } from './../../../../shared/models/tambol/request/tambolSearchPostCodeRequest';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-detail-stakeholder',
  templateUrl: './detail-stakeholder.component.html',
  styleUrls: ['./detail-stakeholder.component.scss']
})
export class DetailStakeholderComponent implements OnInit {
  @ViewChild('automatAutocomplete', { static: false }) movieSearchInput: ElementRef;
  @ViewChild('postCodeSearchInput', { static: false }) postCodeSearchInput: ElementRef;
  @ViewChild('saveStakeholderSwal',{static:false}) saveStakeholderSwal:SwalComponent;
  @ViewChild('successStakeholderSwal',{static:false}) successStakeholderSwal:SwalComponent;
  @ViewChild('errorStakeholderSwal',{static:false}) errorStakeholderSwal:SwalComponent
  @ViewChild("automatAutocomplete",{ read: MatAutocompleteTrigger ,static:true }) matAutocomplete:MatAutocompleteTrigger
  searchLoading = false;
  addStakeholderForm: FormGroup;
  submitted = false;
  options = [];
  provinceCode:string;
  amphurCode:string;
  tambolCode:string;
  stakeholderCode:string;
  constructor(
    public dialogRef: MatDialogRef<DetailStakeholderComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuiler: FormBuilder,
    private noWhitespaceValidator:noWhitespaceValidator,
    private tambolSearchRequest: TambolSearchRequest,
    private tambolService: TambolserviceService,
    private tambolSearchPostCodeRequest:tambolSearchPostCodeRequest,
    private stakeholderEditRequest:StakeholderEditRequest,
    private loading:NgxSpinnerService,
    private stakeholderService:StakeholderService,
  ) { }

  ngOnInit() {
    this.setFormGroup();
  }

  get f() { return this.addStakeholderForm.controls; }

  displayFn(user: any): string | undefined {
    return user ? user.addrName : undefined;
  }

  onSubmit() {
    this.submitted = true;
    if (this.addStakeholderForm.invalid) {
      return;
    } else {
      this.saveStakeholderSwal.show();
    }
  }

  onSelectAddr(e) {
    this.provinceCode = e.source.value.provinceCode;
    this.amphurCode = e.source.value.amphurCode;
    this.tambolCode = e.source.value.tambolCode;
    console.log(this.provinceCode+" "+this.amphurCode+" "+this.tambolCode);
    this.addStakeholderForm.controls['stakeholderPostCode'].setValue(e.source.value.postCode);
  }

  setFormGroup(){
    let addrStr = this.data.stakeholder.ppiMsProvince.provinceName;
      this.addStakeholderForm = this._formBuiler.group({
        stakeholderCodeEdit: [this.data.stakeholder.stakeholderCode],
        stakeholderName: [this.data.stakeholder.stakeholderName, Validators.required,this.noWhitespaceValidator.noWhitespace],
        stakeholderAddr: [addrStr, Validators.required],
        stakeholderPostCode: [this.data.stakeholder.postcode, Validators.required,this.noWhitespaceValidator.noWhitespace],
        stakeholderTaxNo: [this.data.stakeholder.taxId, Validators.required,this.noWhitespaceValidator.noWhitespace],
        stakeholderAddress1: [this.data.stakeholder.address, Validators.required,this.noWhitespaceValidator.noWhitespace],
      });
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

  onNoClick(): void {
    this.dialogRef.close(true);
  }
  
  updateStakeholder(){
    this.stakeholderEditRequest.stakeholderCode = this.addStakeholderForm.controls['stakeholderCodeEdit'].value;
    this.stakeholderEditRequest.stakeholderName = this.addStakeholderForm.controls['stakeholderName'].value;
    this.stakeholderEditRequest.taxId = this.addStakeholderForm.controls['stakeholderTaxNo'].value;
    this.stakeholderEditRequest.postCode = this.addStakeholderForm.controls['stakeholderPostCode'].value;
    this.stakeholderEditRequest.address = this.addStakeholderForm.controls['stakeholderAddress1'].value;
   
    this.onUpdateStakeholder(this.stakeholderEditRequest);
  }

  onUpdateStakeholder(request){
    this.loading.show();
    this.stakeholderService.editStakeholder(request)
    
    .subscribe(
      (res) => {
        this.stakeholderCode = res;
        this.loading.hide();
        this.successStakeholderSwal.show();
      },
      (error) => {
        this.errorStakeholderSwal.text = error.error.messageEn;
        this.errorStakeholderSwal.title = error.error.messageTh;
        this.loading.hide();
        this.errorStakeholderSwal.show();
      }
    )

  }
}
