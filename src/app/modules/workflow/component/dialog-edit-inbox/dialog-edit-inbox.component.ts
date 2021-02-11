import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { EditWorkFlowRequest } from 'src/app/shared/models/workflow/request/EditWorkFlowRequest.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-dialog-edit-inbox',
  templateUrl: './dialog-edit-inbox.component.html',
  styleUrls: ['./dialog-edit-inbox.component.scss']
})
export class DialogEditInboxComponent implements OnInit {

  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;

  submitted = false;
  editWorkflowForm: FormGroup;
  minDate = new Date();

  workflowObj: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditInboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>,
    private workflowService: WorkflowService,
    private editWorkflowRequest: EditWorkFlowRequest
  ) {
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {

    this.workflowObj = this.data.element;
    console.log(this.workflowObj);

    this.editWorkflowForm = this._FormBuild.group({
      workflowId: [this.data.element.workflowId, Validators.required],
      extendedDate: [new Date(this.data.element.extendedDate), Validators.required],
      note: [this.data.element.note, Validators.required]
    });

  }

  get f() { return this.editWorkflowForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editWorkflowForm.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  editWorkflow() {
    this.editWorkflowRequest.workFlowId = this.editWorkflowForm.value.workflowId;
    this.editWorkflowRequest.extendedDate = new Date(this.editWorkflowForm.value.extendedDate);
    this.editWorkflowRequest.note = this.editWorkflowForm.value.note;
    this.loading.show();
    this.workflowService.editWorkflow(this.editWorkflowRequest).subscribe((res) => {
      this.loading.hide();
      this.succussSwal.show();
    },
      (error) => {
        this.loading.hide();
        console.log(error);
      });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
