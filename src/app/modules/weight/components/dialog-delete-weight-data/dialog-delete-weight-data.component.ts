import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WeightService } from 'src/app/core/service/weight/weight.service';
import { DeleteWeightDataRequest } from 'src/app/shared/models/weight/request/DeleteWeightDataRequest';

@Component({
  selector: 'app-dialog-delete-weight-data',
  templateUrl: './dialog-delete-weight-data.component.html',
  styleUrls: ['./dialog-delete-weight-data.component.scss']
})
export class DialogDeleteWeightDataComponent implements OnInit {

  @ViewChild('deleteSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  deleteWeightDataForm: FormGroup;
  weightData;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteWeightDataComponent>,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weightService: WeightService,
    private deleteWeightDataRequest: DeleteWeightDataRequest
  ) { }

  ngOnInit() {

    console.log(this.data);

    this.weightData = this.data.weight;

    this.deleteWeightDataForm = this._FormBuild.group({
      id: [this.weightData.weightDataId, Validators.required],
      deletedNote: [''],
      actionId: [this.data.action.paramId]
    });

  }

  onSubmit() {
    console.log(this.deleteWeightDataForm);
    this.submitted = true;
    if (this.deleteWeightDataForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  get f() { return this.deleteWeightDataForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }

  deleteWeightData() {
    this.loading.show();
    // this.deleteWeightDataRequest.dataId = this.deleteWeightDataForm.value.id 
    // this.deleteWeightDataRequest.deletedNote = this.deleteWeightDataForm.value.deletedNote
    // this.deleteWeightDataRequest.actionId = this.deleteWeightDataForm.value.actionId
    this.weightService.deleteActionWeightDataById(this.deleteWeightDataRequest).subscribe(
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

}
