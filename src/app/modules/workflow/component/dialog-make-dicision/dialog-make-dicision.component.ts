import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MakeDecisionRequest } from 'src/app/shared/models/workflow/request/MakeDecisionRequest.model';


@Component({
  selector: 'app-dialog-make-dicision',
  templateUrl: './dialog-make-dicision.component.html',
  styleUrls: ['./dialog-make-dicision.component.scss']
})
export class DialogMakeDicisionComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  makeDecisionForm: FormGroup;

  statusList = [{ th: 'อนุมัติ', en: 'APPROVE' }, { th: 'ไม่อนุมัติ', en: 'REJECT' }]

  constructor(
    public dialogRef: MatDialogRef<DialogMakeDicisionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    private workflowService: WorkflowService,
    private makeDecisionRequest: MakeDecisionRequest
  ) { }

  ngOnInit() {

    this.makeDecisionForm = this._FormBuild.group({
      workflowId: [this.data, Validators.required],
      status: ["", Validators.required],
      decisionNote: [""]
    });

  }

  onSubmit() {
    this.submitted = true;
    if (this.makeDecisionForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  get f() { return this.makeDecisionForm.controls; }

  closeDialog() {
    this.dialogRef.close(true);
  }

  onselectStatus(event) {
    if (event.value == 'APPROVE') {
      this.makeDecisionForm.controls['decisionNote'].clearValidators();
    }
    else if (event.value == 'REJECT') {
      this.makeDecisionForm.controls['decisionNote'].setValidators([Validators.required]);
    }
    this.makeDecisionForm.controls['decisionNote'].updateValueAndValidity();
  }

  makeDecision() {
    this.makeDecisionRequest.workflowId = this.makeDecisionForm.value.workflowId;
    this.makeDecisionRequest.status = this.makeDecisionForm.value.status;
    this.makeDecisionRequest.decisionNote = this.makeDecisionForm.value.decisionNote;
    this.loading.show();
    this.workflowService.makeDecisionWorkflow(this.makeDecisionRequest).subscribe((res) => {
      this.loading.hide();
      this.succussSwal.show();
    },
      (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

}
