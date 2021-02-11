import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParamService } from 'src/app/core/service/param/param.service';
import { ApplicationConstant } from 'src/app/shared/constants/ApplicationConstant';
import { IndexMatrixService } from 'src/app/core/service/indexmatrix/index-matrix.service';
import { InquiryProvinceNameResponse } from 'src/app/shared/models/weight/request/InquiryProvinceNameResponse.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CpipMsIndexMatrixRequestForm } from 'src/app/shared/models/index-matrix/CpipMsIndexMatrixRequestForm';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

const constants = ApplicationConstant;
@Component({
  selector: 'app-dialog-add-index-matrix',
  templateUrl: './dialog-add-index-matrix.component.html',
  styleUrls: ['./dialog-add-index-matrix.component.scss']
})
export class DialogAddIndexMatrixComponent implements OnInit {
  @ViewChild("addIndexMatrixSwal",{static:false}) addIndexMatrixSwal:SwalComponent;
  @ViewChild("succussIndexMatrixSwal",{static:false}) succussIndexMatrixSwal:SwalComponent;

  cpipMsIndexMatrixRequestForm:CpipMsIndexMatrixRequestForm;
  addIndexMatrixForm:FormGroup;
  listIndexGroupAdd = new Array();
  listIndexMatrixAdd = new Array();
  listIndexMatrixProvinceAdd = new Array();
  isShowSaveAdd = false;
  isShowRegionInputAdd = false;
  isShowProvinceInputAdd = false;
  isDisable = false;
  isDisableSelect = true;
  groupAdd;
  indexMatrixId;
  indexGroupAdd;
  regionIdAdd;
  provinceIdAdd;
  listProvinceDataAdd = new Array<InquiryProvinceNameResponse>();
  constructor(
    public dialogRef: MatDialogRef<DialogAddIndexMatrixComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loading: NgxSpinnerService,
    // private _formBuilder:FormBuilder,
    private indexMatrixService: IndexMatrixService,
    private paramService: ParamService
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.preparePage();
    if(this.data != null){
      if(this.data>0){
        this.indexGroupAdd = this.data;
      } else {
        this.isDisable = true;
        this.indexMatrixId = this.data.indexMatrixId;
        this.indexGroupAdd = this.data.indexGroup.paramInfoId;
        if(this.data.province!=null){
          this.provinceIdAdd = this.data.province.provinceId;
        } else {
          this.regionIdAdd = this.data.region.regionId;
        }
      }
      this.selectIndexGroup();
    } else {
      this.isDisable = false;
      this.isDisableSelect = false;
    }
    // this.setProvinceData();
    // this.addIndexMatrixForm = this._formBuilder.group({
    //   indexGroup:['',Validators.required]
    // })
  }

  preparePage() {
    this.listIndexGroupAdd = this.paramService.getParamByGroup(constants.ParamGroup.indexGroup);
  }

  setProvinceData(){
    this.loading.show();
    let indexGroup = this.listIndexGroupAdd.find(x => x.paramInfo === 'CPIP');
    if(indexGroup != null){
      this.indexMatrixService.inquiryIndexMatrix(indexGroup.paramId).subscribe((res) => {
        this.loading.hide();
        this.listProvinceDataAdd = res.provinceNameList;
      }, (error) => {
        this.loading.hide();
      });
    }
  }

  selectIndexGroup() {
    this.groupAdd = this.listIndexGroupAdd.find(i => i.paramId === this.indexGroupAdd);
    if (this.groupAdd.paramInfo === 'CPIP') {
      this.isShowProvinceInputAdd = true;
      this.isShowRegionInputAdd = false;
    }
    else {
      this.isShowProvinceInputAdd = false;
      this.isShowRegionInputAdd = true;
    }

    this.isShowSaveAdd = false;
    this.listIndexMatrixAdd = new Array();
    this.listIndexMatrixProvinceAdd = new Array();
    this.regionIdAdd = null;
    this.provinceIdAdd = null;
    this.loading.show();
    console.log('e value onSelectIndexGroup => ', this.indexGroupAdd);

    this.indexMatrixService.getRegionOrProvinceByIndexMatrix(this.indexGroupAdd).subscribe((res) => {
        this.loading.hide();
        console.log('res regionnn', res.regionNameList);
        if (this.groupAdd.paramInfo != 'CPIP') {
          this.listIndexMatrixAdd = res.regionNameList;
        } else {
          this.listIndexMatrixProvinceAdd = res.provinceNameList;
        }
      },(error) => {
        this.loading.hide();
    });
  }

  onSelectRegion(e) {
    this.isShowSaveAdd = true;
  }

  onSubmit(){
    this.addIndexMatrixSwal.show();
  }

  onSave(){
    // console.log('################');
    // console.log(this.indexGroupAdd);
    // console.log(this.regionIdAdd);
    // console.log(this.provinceIdAdd);
    this.loading.show();
    this.cpipMsIndexMatrixRequestForm = new CpipMsIndexMatrixRequestForm();
    this.cpipMsIndexMatrixRequestForm.indexGroupId = this.indexGroupAdd;
    if (this.groupAdd.paramInfo != 'CPIP') {
      this.cpipMsIndexMatrixRequestForm.regionId = this.regionIdAdd;
    } else {
      this.cpipMsIndexMatrixRequestForm.provinceId = this.provinceIdAdd;
    }
    if(this.indexMatrixId != null){
      this.cpipMsIndexMatrixRequestForm.indexMatrixId = this.indexMatrixId;
    }
    this.indexMatrixService.saveCpipMsIndexMatrix(this.cpipMsIndexMatrixRequestForm).subscribe(
      (res) => {
        this.loading.hide();
        this.succussIndexMatrixSwal.show();
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

}
