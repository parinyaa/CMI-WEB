import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, DateAdapter} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {InsertWorkflowRequest} from 'src/app/shared/models/workflow/request/InsertWorkflowRequest.model';
import {WorkflowService} from 'src/app/core/service/workflow/workflow.service';

@Component({
  selector: 'app-dialog-create-inbox',
  templateUrl: './dialog-create-inbox.component.html',
  styleUrls: ['./dialog-create-inbox.component.scss'],
})
export class DialogCreateInboxComponent implements OnInit {
  @ViewChild('addSwal', {static: false}) addSwal: SwalComponent;
  @ViewChild('succussSwal', {static: false}) succussSwal: SwalComponent;
  @ViewChild('errorSwal', {static: false}) errorSwal: SwalComponent;

  frequency;
  durationList = new Array();

  submitted = false;
  createWorkflowForm: FormGroup;
  minDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<DialogCreateInboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormBuild: FormBuilder,
    private loading: NgxSpinnerService,
    private dateAdapter: DateAdapter<Date>,
    private insertWorkflowRequest: InsertWorkflowRequest,
    private workflowService: WorkflowService,
  ) {
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {
    console.log(this.data);

    this.frequency = this.data.frequency;
    this.durationList = this.data.durationList;

    this.createWorkflowForm = this._FormBuild.group({
      workflowTypeId: [this.data.workflowType.paramId, Validators.required],
      frequency: [this.data.frequency.paramLocalMessage, Validators.required],
      durationCode: ['', Validators.required],
      extendedDate: [new Date(), Validators.required],
      note: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.createWorkflowForm.invalid) {
      return;
    } else {
      this.addSwal.show();
    }
  }

  onselectFrequency(event) {
    this.createWorkflowForm.controls['durationCode'].reset(null);
    if (event.value.paramInfo == 'MONTHLY') {
      this.durationList = this.data.durationMonthList;
    } else if (event.value.paramInfo == 'WEEKLY') {
      this.durationList = this.data.durationWeekList;
    } else if (event.value.paramInfo == 'FORTNIGHTLY') {
      this.durationList = this.data.durationFortnightList;
    }
  }

  get f() {
    return this.createWorkflowForm.controls;
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  addWorkflow() {
    this.insertWorkflowRequest.workflowTypeId = this.createWorkflowForm.value.workflowTypeId;
    this.insertWorkflowRequest.frequency = this.frequency.paramId;
    this.insertWorkflowRequest.durationCode = this.createWorkflowForm.value.durationCode;
    this.insertWorkflowRequest.extendedDate = new Date(
      this.createWorkflowForm.value.extendedDate,
    );
    this.insertWorkflowRequest.note = this.createWorkflowForm.value.note;
    console.log(' this.insertWorkflowRequest', this.insertWorkflowRequest);
    this.loading.show();
    this.workflowService.insertWorkflow(this.insertWorkflowRequest).subscribe(
      (res) => {
        this.loading.hide();
        this.succussSwal.show();
      },
      (error) => {
        this.loading.hide();
        console.log(error);
      },
    );
  }
}
