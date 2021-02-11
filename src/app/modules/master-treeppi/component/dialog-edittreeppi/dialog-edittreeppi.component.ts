import { NgxSpinnerService } from 'ngx-spinner';
import { ParamService } from './../../../../core/service/param/param.service';
import { PpitreeService } from './../../../../core/service/ppitree/ppitree.service';
import { PpiEditRequest } from './../../../../shared/models/ppitree/request/PpiEditRequest';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-dialog-edittreeppi',
  templateUrl: './dialog-edittreeppi.component.html',
  styleUrls: ['./dialog-edittreeppi.component.scss']
})
export class DialogEdittreeppiComponent implements OnInit {
  @ViewChild("editPpiTreeSwal",{static:false}) editPpiTreeSwal:SwalComponent;
  @ViewChild("sucessPpiTreeSwal",{static:false}) sucessPpiTreeSwal:SwalComponent;
  
  editPpiForm:FormGroup;
  submitted = false;
  showInputCpa = false;
  MEASURE_UNIT = new Array();
  FREQUENCY = new Array();
  CURRENCY_UNIT = new Array();
  constructor(
    public dialogRef: MatDialogRef<DialogEdittreeppiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fromBuilder:FormBuilder,
    private noWhitespaceValidator:noWhitespaceValidator,
    private ppiEditRequest:PpiEditRequest,
    private ppitreeService:PpitreeService,
    private loading:NgxSpinnerService,
    private paramService:ParamService,
  ) { 
 
  }
  ngOnInit() {
    console.log(this.data);
    this.editPpiForm = this._fromBuilder.group({
      commodityCode:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      commodityThName:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      commodityEnName:['',Validators.required,this.noWhitespaceValidator.noWhitespace]
    });
    this.editPpiForm.controls['commodityCode'].setValue(this.data.commodityCode);
    this.editPpiForm.controls['commodityThName'].setValue(this.data.commodityThName);
    this.editPpiForm.controls['commodityEnName'].setValue(this.data.commodityEnName);
    if(this.data.commodityLevel > 6){
      this.showInputCpa = true;
      this.paramService.getParamsGroupAll().subscribe(
        (res) => {
            this.getParams();
        }
      );
      this.editPpiForm.addControl('frequency',new FormControl('',Validators.required));
      this.editPpiForm.addControl('measureUnit',new FormControl('',Validators.required));
      this.editPpiForm.addControl('noOfCarrierForward',new FormControl('',Validators.required));
      this.editPpiForm.addControl('priceChangePercentage',new FormControl('',Validators.required));
      this.editPpiForm.addControl('currencyUnit',new FormControl('',Validators.required));
      this.setFormInputEditCPA();
    }
  }

  setFormInputEditCPA(){
    this.editPpiForm.controls['frequency'].setValue(this.data.frequencyId.paramInfoId);
    this.editPpiForm.controls['measureUnit'].setValue(this.data.measureUnitId.paramInfoId);
    this.editPpiForm.controls['noOfCarrierForward'].setValue(this.data.noOfCarrierForward);
    this.editPpiForm.controls['currencyUnit'].setValue(this.data.currencyUnitId.paramInfoId);
    this.editPpiForm.controls['priceChangePercentage'].setValue(this.data.priceChangePercentage);
  }

  getParams(){
     this.FREQUENCY  = this.paramService.getParamByGroup("FREQUENCY");
     this.MEASURE_UNIT  = this.paramService.getParamByGroup("MEASURE_UNIT");
     this.CURRENCY_UNIT  = this.paramService.getParamByGroup("CURRENCY_UNIT");
    }

  selectionChangeFrequency(e){
    console.log(e.source.value);
    // this.ppiEditRequest.frequencyId = e.source.value;
    this.editPpiForm.controls['frequency'].setValue(e.source.value);
  }

  selectionChangeMeasureUnit(e){
    console.log(e.source.value);
    // this.ppiEditRequest.measureUnitId = e.source.value;
    this.editPpiForm.controls['measureUnit'].setValue(e.source.value);
  }

  selectionChangeCurrencyUnit(e){
    console.log(e.source.value);
    // this.ppiEditRequest.currencyUnitId = e.source.value;
    this.editPpiForm.controls['currencyUnit'].setValue(e.source.value);
  }

  closeDialog(){
    this.dialogRef.close(true);
  }

  get f(){return this.editPpiForm.controls;}

  onSubmit(){
    this.submitted = true;
    if(this.editPpiForm.invalid){
      return;
    }else{
      this.editPpiTreeSwal.show();
    }
  }

  onEditPpiTree(){
    this.loading.show();
    this.ppiEditRequest.commodityCode = this.data.commodityCode;
    this.ppiEditRequest.commodityThName = this.editPpiForm.controls['commodityThName'].value;
    this.ppiEditRequest.commodityEnName = this.editPpiForm.controls['commodityEnName'].value;
    if(this.data.commodityLevel >= 7){
      this.ppiEditRequest.noOfCarrierForward =  this.editPpiForm.controls['noOfCarrierForward'].value;
      this.ppiEditRequest.priceChangePercentage =  this.editPpiForm.controls['priceChangePercentage'].value;
      this.ppiEditRequest.frequencyId =  this.editPpiForm.controls['frequency'].value;
      this.ppiEditRequest.measureUnitId =  this.editPpiForm.controls['measureUnit'].value;
      this.ppiEditRequest.currencyUnitId =  this.editPpiForm.controls['currencyUnit'].value;
    }
    console.log(this.ppiEditRequest);
    this.ppitreeService.editNode(this.ppiEditRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucessPpiTreeSwal.show();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

}
