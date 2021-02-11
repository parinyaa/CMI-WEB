import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogCommentComponent } from '../../keyin-data/component/dialog-comment/dialog-comment.component';
import { CommemtSaveRequest } from 'src/app/shared/models/datadaily/CommentSaveRequest';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommodityService } from 'src/app/core/service/commodity/commodity.service';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { ParamService } from 'src/app/core/service/param/param.service';
import { InsertWorkflowRequest } from 'src/app/shared/models/workflow/request/InsertWorkflowRequest.model';
import { EditWorkFlowRequest } from 'src/app/shared/models/workflow/request/EditWorkFlowRequest.model';

@Component({
  selector: 'app-dialog-comment-validate',
  templateUrl: './dialog-comment-validate.component.html',
  styleUrls: ['./dialog-comment-validate.component.scss']
})
export class DialogCommentValidateComponent implements OnInit {

  addComment: FormGroup;
  comment = new Array();
  priceData;

  btnSend = true;
  btnApprove = false;
  btnReject = false;
  btnComment = false;
  btnAnswer = false;
  submitted = false;

  hasRelativeAnswer;
  hasRelativeCreate;

  constructor(
    public dialogRef: MatDialogRef<DialogCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commemtSaveRequest: CommemtSaveRequest,
    private loading: NgxSpinnerService,
    private commodityService: CommodityService,
    private sessionService: SessionServiceService,
    private workflowService: WorkflowService,
    private paramService: ParamService,
    private _formBuilder: FormBuilder,
  ) {
    this.priceData = this.data.data;
  }

  ngOnInit() {
    console.log(this.priceData);
    this.hasRelativeAnswer = this.sessionService.checkProfileIsContainObject('REVIEW_FN_ANSWER_COMMENT');
    this.hasRelativeCreate = this.sessionService.checkProfileIsContainObject('REVIEW_FN_CREATE_COMMENT');
    console.log('hasRelativeCreate', this.hasRelativeCreate);
    console.log('hasRelativeAnswer', this.hasRelativeAnswer);
    this.addComment = this._formBuilder.group({
      strComment: ['', Validators.required]
    });
    this.getComment();
    this.checkRoleButton();
  }

  getComment() {
    if (this.priceData.commentNote != null) {
      this.comment = this.priceData.commentNote.split('$/N');
    }
  }

  get f() {
    return this.addComment.controls;
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  setColorChat(e) {
    let userName = this.sessionService.getUserProfile().localFirstName;
    let result = e.search(userName);
    if (result == -1) {
      return false;
    } else {
      return true;
    }
  }

  checkRoleButton() {
    if (this.hasRelativeCreate && this.data.data.answerCommentFlag === 'Y' && this.data.data.requestCommentFlag === 'Y') {
      this.btnApprove = true;
      this.btnReject = true;
      this.btnSend = false;
    }

  }

  onSubmit() {
    this.submitted = true;
    if (this.addComment.invalid) {
      return;
    } else {
      console.log(this.addComment.value);
      this.onSaveComment();
    }
  }

  onSaveComment() {
    this.loading.show();
    let comment = this.addComment.controls['strComment'].value;
    let userName = this.sessionService.getUserProfile().localFirstName + ' : ';
    let newComment = userName;
    let mode = 'save';
    if (this.priceData.commentNote != null) {
      newComment = this.priceData.commentNote + '$/N' + userName;
    }
    this.priceData.commentNote = newComment + comment;
    if (this.hasRelativeCreate && !this.hasRelativeAnswer) {
      if (this.priceData.requestCommentFlag === 'N'
        && this.priceData.answerCommentFlag === 'N'
        && this.priceData.commentFlag === 'N') {
        mode = 'new';
      }
      this.priceData.requestCommentFlag = 'Y';
      this.priceData.answerCommentFlag = 'N';
      this.priceData.commentFlag = 'Y';
    }
    else if (!this.hasRelativeCreate && this.hasRelativeAnswer) {
      this.priceData.answerCommentFlag = 'Y';
    }
    this.processSaveComment(mode);
  }

  onApproveComment() {
    this.loading.show();
    this.priceData.answerCommentFlag = 'N';
    this.priceData.requestCommentFlag = 'N';
    this.processSaveComment('approve');
  }

  onRejectComment() {
    this.loading.show();
    this.priceData.requestCommentFlag = 'Y';
    this.priceData.answerCommentFlag = 'N';
    this.processSaveComment('reject');
  }

  processSaveComment(mode) {
    this.commemtSaveRequest.baseYear = this.priceData.baseYearId;
    this.commemtSaveRequest.yearTerm = this.priceData.yearTerm;
    this.commemtSaveRequest.monthTerm = this.priceData.monthTerm;
    this.commemtSaveRequest.cpaId = this.priceData.cpaId;
    this.commemtSaveRequest.requestCommentFlag = this.priceData.requestCommentFlag;
    this.commemtSaveRequest.answerCommentFlag = this.priceData.answerCommentFlag;
    this.commemtSaveRequest.commentNote = this.priceData.commentNote;
    this.commemtSaveRequest.commentFlag = this.priceData.commentFlag;
    this.commodityService.saveComment(this.commemtSaveRequest).subscribe(
      (res) => {
        this.loading.hide();
        if (mode === 'new') {
          this.processInsertRelativeWorkflow();
        } else if (mode === 'approve') {
          this.processApproveRelativeWorkflow();
        } else {
          this.processReplyRelativeWorkflow();
        }
      }, (error) => {
        this.loading.hide();
        this.dialogRef.close();
      }
    );
  }

  private processInsertRelativeWorkflow(): void {
    let workflowRequest: InsertWorkflowRequest = new InsertWorkflowRequest();
    console.log(this.priceData);
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.cpaId = this.commemtSaveRequest.cpaId;
    if (this.priceData.createdBy) {
      workflowRequest.assignTo = this.priceData.createdBy;
    } else {
      workflowRequest.assignTo = this.priceData.updatedBy;
    }
    workflowRequest.creatorUrl = '/commodityvalidate';
    workflowRequest.assignUrl = '/commodityvalidate';
    const paramWorkflowType = this.paramService.getParamByGroupCodeAndInfoCode('WORKFLOW_TYPE', 'REVIEW_RELATIVE');
    workflowRequest.workflowTypeId = paramWorkflowType.paramId;
    const paramInfoMessage = this.paramService.getParamByGroupCodeAndInfoCode('INFO_MESSAGE', 'REVIEW_RELATIVE');
    const infoMessage = '$1' + this.priceData.parentCommodityCode + '$1'
      + this.priceData.parentCommodityThName;
    const message = paramInfoMessage.paramLocalMessage.replace('(###1)', infoMessage);
    workflowRequest.note = message.substr(0, 250);
    this.loading.show();
    this.workflowService.insertWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.priceData);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  private processApproveRelativeWorkflow(): void {
    let workflowRequest: EditWorkFlowRequest = new EditWorkFlowRequest();
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.cpaId = this.commemtSaveRequest.cpaId;
    const paramWorkflowStatus = this.paramService.getParamByGroupCodeAndInfoCode('REVIEW_PRICE_STATUS', 'APPROVE');
    workflowRequest.status = paramWorkflowStatus.paramInfo;
    this.loading.show();
    this.workflowService.approveReviewRelativeWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.priceData);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  private processReplyRelativeWorkflow(): void {
    let workflowRequest: EditWorkFlowRequest = new EditWorkFlowRequest();
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.cpaId = this.commemtSaveRequest.cpaId;
    this.loading.show();
    this.workflowService.replyReviewRelativeWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.priceData);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }


}
