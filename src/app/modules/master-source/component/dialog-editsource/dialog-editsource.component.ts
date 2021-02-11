import { element } from 'protractor';
import { ContactAddRequest } from './../../../../shared/models/contact/request/contactaddrequest';
import { noWhitespaceValidator } from './../../../../shared/common/noWhitespaceValidator';
import { SourceService } from './../../../../core/service/source/source.service';
import { SourceEditRequest } from './../../../../shared/models/source/request/sourceeditrequest';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactEditRequest } from 'src/app/shared/models/contact/request/contactEditRequest';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-editsource',
  templateUrl: './dialog-editsource.component.html',
  styleUrls: ['./dialog-editsource.component.scss']
})
export class DialogEditsourceComponent implements OnInit {
  @ViewChild("saveSourceSwal",{static:false}) saveSourceSwal:SwalComponent;
  @ViewChild("sucessSourceSwal",{static:false}) sucessSourceSwal:SwalComponent;
  @ViewChild("errorSourceSwal",{static:false}) errorSourceSwal:SwalComponent;
  
  editSourceForm:FormGroup;
  submitted = false;
  @Input()
  data: any;
  constructor(
    // public dialogRef: MatDialogRef<DialogEditsourceComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder:FormBuilder,
    private sourceEditRequest:SourceEditRequest,
    private sourceService:SourceService,
    private loading:NgxSpinnerService,
    private noWhitespaceValidator:noWhitespaceValidator,
    private router: Router,
    private _formBuiler: FormBuilder,
  ) { }


  ngOnInit() {
    console.log("history.state",history.state)
    // if (!history.state.sourceCode) {
      // this.router.navigateByUrl("survey");
      console.log("history.state not found")
    // }
    console.log("history.state  found")
    // this.data = history.state['sourceCode'];
    this.editSourceForm  = this._formBuilder.group({
      sourceName:['',Validators.required],
      address:['',Validators.required],
      sourceTaxNo:['',Validators.required],
      contact: this._formBuilder.array([])
    })
    if(this.data){
      this.setInputOnEdit();
    }else{
      history.back();
    }
   
  }

  get contactForms() {
    return this.editSourceForm.get('contact') as FormArray
  }

  setInputOnEdit(){
    this.editSourceForm.controls['sourceName'].setValue(this.data.source.sourceName);
    this.editSourceForm.controls['address'].setValue(this.data.source.address);
    this.editSourceForm.controls['sourceTaxNo'].setValue(this.data.source.taxId);
    const contact = this.editSourceForm.controls['contact'] as FormArray;
    let contactEdit = this.data.source.ppiMsContactPeople;
    let setValuesContact = [];
    if(contactEdit!=null && contactEdit.length > 0 ){
      for(var i = 0 ; i < contactEdit.length ; i++ ){
        contact.push(this._formBuilder.group({
          surveyContactName: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
          surveyContactPhone: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
          surveyContactFaxNo: [''],
          surveyContactMobileNo: [''],
          surveyContactEmail: [''],
          contactPersonId:['']
        }));
        setValuesContact.push({contactPersonId:contactEdit[i].contactPersonId,surveyContactName:contactEdit[i].contactName,surveyContactPhone:contactEdit[i].telephoneNo,surveyContactFaxNo:contactEdit[i].faxNo,
          surveyContactMobileNo:contactEdit[i].mobileNo,surveyContactEmail:contactEdit[i].email});

      }
      contact.setValue(setValuesContact);
    }
  }

  get f(){return this.editSourceForm.controls}

  onSubmit(){
    this.submitted = true;
    if(this.editSourceForm.invalid){
      return;
    }else{
     this.saveSourceSwal.show();
    }
  }
  

  addContact() {
    const contact = this.editSourceForm.controls['contact'] as FormArray;
    contact.push(this._formBuiler.group({
      surveyContactName: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyContactPhone: ['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      surveyContactFaxNo: [''],
      surveyContactMobileNo: [''],
      surveyContactEmail: [''],
      contactPersonId:['']
    }));
  }

  removeGroup(i: number) {
    const control = <FormArray>this.editSourceForm.controls['contact'];
    control.removeAt(i);
  }

  // onNoClick(){
  //   this.dialogRef.close(true);
  // }

  editSource(){
    this.loading.show();
    this.sourceEditRequest.sourceId = this.data.source.sourceId;;
    this.sourceEditRequest.sourceName =  this.editSourceForm.controls['sourceName'].value;
    this.sourceEditRequest.address =  this.editSourceForm.controls['address'].value;
    this.sourceEditRequest.taxId =  this.editSourceForm.controls['sourceTaxNo'].value;
    let contact = this.editSourceForm.controls['contact'].value;
    let contactList = new Array();
    if(contact!= null && contact.length > 0){
       contact.forEach(element => {
         console.log(element);
          let contactEditRequest = new ContactEditRequest();
          contactEditRequest.contactPersonId = element.contactPersonId;
          contactEditRequest.contactName = element.surveyContactName;
          contactEditRequest.telephoneNo = element.surveyContactPhone;
          contactEditRequest.faxNo = element.surveyContactFaxNo;
          contactEditRequest.mobileNo = element.surveyContactMobileNo;
          contactEditRequest.email = element.surveyContactEmail;
          contactList.push(contactEditRequest);
       });
       
    }
    this.sourceEditRequest.contacts = contactList;
    console.log( this.sourceEditRequest);
    this.sourceService.editSource(this.sourceEditRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucessSourceSwal.show();
      },
      (error) => {
        this.errorSourceSwal.text = error.error.messageEn;
        this.errorSourceSwal.title = error.error.messageTh;
        this.loading.hide();
        this.errorSourceSwal.show();
      }
    )
  }

}
