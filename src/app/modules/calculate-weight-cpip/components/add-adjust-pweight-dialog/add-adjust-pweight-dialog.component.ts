import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ReqEditPweight } from 'src/app/shared/models/weight/request/ReqEditPweight.model';
import { WeightCpipService } from 'src/app/core/service/weightcpip/weight-cpip.service';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { Message } from 'src/app/shared/message';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-adjust-pweight-dialog',
  templateUrl: './add-adjust-pweight-dialog.component.html',
  styleUrls: ['./add-adjust-pweight-dialog.component.scss']
})
export class AddAdjustPweightDialogComponent implements OnInit {
  @ViewChild('saveSwal', { static: false }) saveSwal: SwalComponent;
  @ViewChild('saveSucessSwal', { static: false }) saveSucessSwal: SwalComponent;
  //@ViewChild('saveSwal', { static: false }) saveErrorSwal: SwalComponent;
  @ViewChild('warningSwal', { static: false }) warningSwal: SwalComponent;
  submitted = false;
  coefficientEF: any;
  coefficientEG: any;
  keep;
  weightId: any;
  isShow = false;
  listWeightCode   =  new Array();
  requestEditPweight = new ReqEditPweight();
  @Input() weight;
  constructor(
    private weightService: WeightCpipService,
    private FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAdjustPweightDialogComponent>

  ) { }

  ngOnInit(): void {
    //console.log('logaddajust1', this.weight);
    this.requestEditPweight.weightId = this.data.value  ;
    this.getTypeweight();
    console.log('logdata', this.data);
  }


  cancel(status) {
    this.dialogRef.close(status);
  }

  getTypeweight(){
    this.loading.show();
    this.weightService.getTypecode(this.data.value).subscribe(res => {
      if (res.code === '200') {
        this.listWeightCode = res.data;
      }
      this.loading.hide();
    },
    (error) => {
      this.loading.hide();
    });
  }
  
  selectResult(item: any, e: MatCheckboxChange){
    console.log('itemmm', item);
    if (e.checked){
      item.selected = true ;
      this.isShow = true;
    }else {
      item.selected = false ;
      this.isShow = false;
    }
  }

  onSave(){
    this.saveSwal.title = Message.MESSAGE_SAVE
    this.saveSwal.show();
  }
  
  onSaveConfirm() {
      this.loading.show();
      const listsave  =  new Array();
      this.listWeightCode.forEach(element => {
        if (element.selected === true){
          listsave.push(element);
        }
      });
      this.requestEditPweight.listData = listsave ;
      this.requestEditPweight.weightId = this.data.value;
      console.log('loglistweight', this.data.value);
      console.log('loglistdata', this.requestEditPweight.listData);
      console.log('loglistid', this.requestEditPweight.weightId);
      this.weightService.updateweight(this.requestEditPweight).subscribe((res) => {
         console.log('insert transaction success', res);
         this.loading.hide();
         if (res.code === '200') {
          this.dialogRef.close(true);
        } else {
          this.warningSwal.title = res.message;
          this.warningSwal.show();
        }
      },
        (error) => {
          this.loading.hide();
        });
  }


}