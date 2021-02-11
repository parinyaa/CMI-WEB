import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { CancelWeightStepRequest } from 'src/app/shared/models/weight/request/CancelWeightStepRequest.model';
import { DeleteWeightDataRequest, WeightData } from 'src/app/shared/models/weight/request/DeleteWeightDataRequest';

@Component({
  selector: 'app-dialog-cancel-weight-step',
  templateUrl: './dialog-cancel-weight-step.component.html',
  styleUrls: ['./dialog-cancel-weight-step.component.scss']
})
export class DialogCancelWeightStepComponent implements OnInit {
  @ViewChild('deleteSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  cancelWeightStepForm: FormGroup;
  weightStep;
  
  constructor(
    public dialogRef: MatDialogRef<DialogCancelWeightStepComponent>,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightService
  ) { }

  ngOnInit() {
    this.cancelWeightStepForm = this._FormBuild.group({
      id: [this.data.weightId, Validators.required],
      cancelNote: [''],
    });
  }

  onSubmit() {
    console.log(this.cancelWeightStepForm);
    this.submitted = true;
    if (this.cancelWeightStepForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  get f() { return this.cancelWeightStepForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }

  deleteWeightData() {
    this.loading.show();

    var weightData = this.data.listData.map(function(item) {
      return item['weightDataId'];
    });
    let weightDataList = new Array();
    for (var i = 0; i < weightData.length; i++) {
      let r = new WeightData();
      r.weightDataId = weightData[i];
      weightDataList.push(r);
    }


    let deleteWeightDataRequest = new DeleteWeightDataRequest();
    deleteWeightDataRequest.action = 'CANCELDELETED';
   // deleteWeightDataRequest.weightId = this.cancelWeightStepForm.value.id;
    deleteWeightDataRequest.deletedNote = this.cancelWeightStepForm.value.cancelNote;
    deleteWeightDataRequest.weightData = weightDataList;
    this.weightService.deleteActionWeightDataById(deleteWeightDataRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        console.log(error.error.messageEn);
        this.errorSwal.text = error.error.messageEn;
        this.errorSwal.title = error.error.messageTh;
        this.loading.hide();
        this.errorSwal.show();
      }
    );
  }

  // cancelWeightStep() {
  //   this.loading.show();

  //   let cancelWeightStepRequest: CancelWeightStepRequest
  //   cancelWeightStepRequest.stepId = this.cancelWeightStepForm.value.id;
  //   cancelWeightStepRequest.cancelNote = this.cancelWeightStepForm.value.cancelNote;


  //   this.weightService.cancelWeightStepById(cancelWeightStepRequest).subscribe(
  //     (res) => {
  //       this.loading.hide();
  //       this.succussSwal.show();
  //     },
  //     (error) => {
  //       console.log(error.error.messageEn);
  //       this.errorSwal.text = error.error.messageEn;
  //       this.errorSwal.title = error.error.messageTh;
  //       this.loading.hide();
  //       this.errorSwal.show();
  //     }
  //   );
  // }
}
