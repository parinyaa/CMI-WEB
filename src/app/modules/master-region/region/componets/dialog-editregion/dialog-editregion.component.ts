import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { RegionService } from './../../../../../core/service/region/region.service';
import { regionEditRequest } from './../../../../../shared/models/region/request/regionEditRequest';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InputUtils } from 'src/app/core/utils/inputUtils/InputUtils';

@Component({
  selector: 'app-dialog-editregion',
  templateUrl: './dialog-editregion.component.html',
  styleUrls: ['./dialog-editregion.component.scss']
})
export class DialogEditregionComponent implements OnInit {

  @ViewChild('editSwal',{static:false}) editSwal:SwalComponent;
  @ViewChild('succussSwal',{static:false}) succussSwal:SwalComponent;
  @ViewChild('errorSwal',{static:false}) errorSwal:SwalComponent;
  editRegionForm:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditregionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild:FormBuilder,
    private regionEditRequst:regionEditRequest,
    private regionService:RegionService,
    private loading:NgxSpinnerService,
    private noWhitespaceValidator:noWhitespaceValidator,
    public inputUtils: InputUtils
  ) { }

  ngOnInit() {
    this.editRegionForm = this._FormBuild.group({
      regionCode:['',Validators.required],
      regionName:['',Validators.required]
    })
    this.editRegionForm.controls['regionCode'].setValue(this.data.regionCode);
    this.editRegionForm.controls['regionName'].setValue(this.data.regionName);
  }

  get f(){return this.editRegionForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.editRegionForm.invalid){
      return
    }else{
      this.editSwal.show();
    }
  }

  editRegion(){
    this.loading.show();
    this.regionEditRequst.regionCode = this.editRegionForm.controls['regionCode'].value;
    this.regionEditRequst.regionName = this.editRegionForm.controls['regionName'].value;
    console.log( this.regionEditRequst);
    this.regionService.editRegion(this.regionEditRequst).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        this.loading.hide();
        this.errorSwal.title = error.error.messageTh;
        this.errorSwal.text = error.error.messageEn;
        this.errorSwal.show();
      }
    )
  } 

  closeDialog(){
    this.dialogRef.close(true);
  }

}
