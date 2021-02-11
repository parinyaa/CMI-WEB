import { debounceTime } from 'rxjs/operators';
import { ParamService } from './../../../../core/service/param/param.service';
import { PpitreeService } from './../../../../core/service/ppitree/ppitree.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { PpiCreateRequest } from 'src/app/shared/models/ppitree/request/PpiCreateRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { noWhitespaceValidator } from 'src/app/shared/common/noWhitespaceValidator';
import { ParamGroup } from 'src/app/shared/common/GetParam';

@Component({
  selector: 'app-dialog-addtreeppi',
  templateUrl: './dialog-addtreeppi.component.html',
  styleUrls: ['./dialog-addtreeppi.component.scss']
})
export class DialogAddtreeppiComponent implements OnInit {
  @ViewChild("savePpiTreeSwal",{static:false}) savePpiTreeSwal:SwalComponent;
  @ViewChild("sucessPpiTreeSwal",{static:false}) sucessPpiTreeSwal:SwalComponent;
  
  addPpiForm:FormGroup;
  submitted = false;
  showInputCpa = false;
  FREQUENCY = new Array();
  MEASURE_UNIT = new Array();
  CURRENCY_UNIT = new Array();
  constructor(
    public dialogRef: MatDialogRef<DialogAddtreeppiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fromBuilder:FormBuilder,
    private ppitreeService:PpitreeService,
    private ppiCreateRequest:PpiCreateRequest,
    private loading:NgxSpinnerService,
    private noWhitespaceValidator:noWhitespaceValidator,
    private paramService:ParamService,
  ) { }

  ngOnInit() {
    console.log(this.data.ppiId ? this.data.ppiId:0);
    this.addPpiForm = this._fromBuilder.group({
      commodityCode:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      commodityThName:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
      commodityEnName:['',Validators.required,this.noWhitespaceValidator.noWhitespace],
    });
    if(this.data.commodityLevel == 6){
      this.showInputCpa = true;
      this.paramService.getParamsGroupAll().subscribe(
        (res) => {this.getParams();}
      )
      this.addPpiForm.addControl('frequency',new FormControl('',Validators.required));
      this.addPpiForm.addControl('measureUnit',new FormControl('',Validators.required));
      this.addPpiForm.addControl('noOfCarrierForward',new FormControl('',Validators.required));
      this.addPpiForm.addControl('priceChangePercentage',new FormControl('',Validators.required));
      this.addPpiForm.addControl('currenctUnit',new FormControl('',Validators.required));
    }
  }


  getParams(){
    this.MEASURE_UNIT  = this.paramService.getParamByGroup(ParamGroup.measureUnit);
    this.FREQUENCY  = this.paramService.getParamByGroup(ParamGroup.frequenct);
    this.CURRENCY_UNIT = this.paramService.getParamByGroup(ParamGroup.currencyUnit);
  }

  getInfo(paramGroup,res){
    let list = new Array(res);
   list[0].forEach(element => {
     if(element.paramGroup == "MEASURE_UNIT"){
       this.MEASURE_UNIT = element.info;
       console.log(this.MEASURE_UNIT);
     }
     if(element.paramGroup == "FREQUENCY"){
      this.FREQUENCY = element.info;
      console.log(this.FREQUENCY);
    }
    if(element.paramGroup == "CURRENCY_UNIT"){
      this.CURRENCY_UNIT = element.info;
      console.log(this.CURRENCY_UNIT);
    }
   });
  }

  selectionChangeFrequency(e){
    console.log(e.source.value.paramId);
    this.ppiCreateRequest.frequencyId = e.source.value.paramId;
  }

  selectionChangeMeasureUnit(e){
    console.log(e.source.value.paramId);
    this.ppiCreateRequest.measureUnitId = e.source.value.paramId;
  }

  selectionChangeCurrenctUnit(e){
    console.log(e.source.value.paramId);
    this.ppiCreateRequest.currencyUnitId = e.source.value.paramId;
  }


  onCreatePpiTree(){
    this.loading.show();
    this.ppiCreateRequest.commodityCode =  this.addPpiForm.controls['commodityCode'].value;
    this.ppiCreateRequest.commodityThName = this.addPpiForm.controls['commodityThName'].value;
    this.ppiCreateRequest.commodityEnName = this.addPpiForm.controls['commodityEnName'].value;
    this.ppiCreateRequest.parenId = this.data.ppiId ? this.data.ppiId:0;
    if(this.data.commodityLevel == 6){
      this.ppiCreateRequest.noOfCarrierForward = this.addPpiForm.controls['noOfCarrierForward'].value;
      this.ppiCreateRequest.priceChangePercentage = this.addPpiForm.controls['priceChangePercentage'].value;
    }
    this.ppitreeService.createPpiTree(this.ppiCreateRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.sucessPpiTreeSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      }
    )
  }

  closeDialog(){
    this.dialogRef.close(true);
  }
  

  get f() { return this.addPpiForm.controls; }

  onSubmit(){
    this.submitted = true;
    if(this.addPpiForm.invalid){
      return;
    }else{
      this.savePpiTreeSwal.show();
    }
  }





}
