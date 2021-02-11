import { NgxSpinnerService } from 'ngx-spinner';
import { CommemtSaveRequest } from './../../../../shared/models/datadaily/CommentSaveRequest';
import { KeydailyService } from './../../../../core/service/keydaily/keydaily.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ParamGroup } from 'src/app/shared/common/GetParam';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { CommodityService } from '../../../../core/service/commodity/commodity.service';
import { SessionServiceService } from '../../../../core/service/common/session-service.service';
import { WorkflowService } from '../../../../core/service/workflow/workflow.service';
import { InsertWorkflowRequest } from '../../../../shared/models/workflow/request/InsertWorkflowRequest.model';
import { ParamService } from '../../../../core/service/param/param.service';
import { EditWorkFlowRequest } from '../../../../shared/models/workflow/request/EditWorkFlowRequest.model';

@Component({
  selector: 'app-dialog-comment',
  templateUrl: './dialog-comment.component.html',
  styleUrls: ['./dialog-comment.component.scss']
})
export class DialogCommentComponent implements OnInit {
  addComment: FormGroup;
  submitted = false;
  userType: number;
  btnApprove = false;
  btnReject = false;
  btnComment = false;
  btnAnswer = false;
  comment = new Array();
  objectUser: any;
  btnSend = true;

  constructor(
    public dialogRef: MatDialogRef<DialogCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private keydailyService: KeydailyService,
    private commemtSaveRequest: CommemtSaveRequest,
    private loading: NgxSpinnerService,
    private commodityService: CommodityService,
    private sessionService: SessionServiceService,
    private workflowService: WorkflowService,
    private paramService: ParamService
  ) {
    this.objectUser = this.sessionService.getUserProfile().objects;
  }

  ngOnInit() {
    console.log('ngOnInitt', this.data);
    this.userType = this.data.typeUser;
    this.checkRoleButton();
    this.addComment = this._formBuilder.group({
      strComment: ['', Validators.required]
    });
    this.getComment();
  }

  checkRoleButton() {
    let approve = this.sessionService.checkProfileIsContainObject('PRICE_FN_APPROVE_COMMENT')
      || this.sessionService.checkProfileIsContainObject('REVIEW_FN_APPROVE_COMMENT');
    let reject = this.sessionService.checkProfileIsContainObject('PRICE_FN_REJECT_COMMENT')
      || this.sessionService.checkProfileIsContainObject('REVIEW_FN_REJECT_COMMENT');
    let comment = this.sessionService.checkProfileIsContainObject('PRICE_FN_CREATE_COMMENT')
      || this.sessionService.checkProfileIsContainObject('REVIEW_FN_CREATE_COMMENT');
    let answer = this.sessionService.checkProfileIsContainObject('PRICE_FN_ANSWER_COMMENT')
      || this.sessionService.checkProfileIsContainObject('REVIEW_FN_ANSWER_COMMENT');
    console.log('userType', this.userType);
    if (approve && this.data.data.answerCommentFlag === 'Y' && this.data.data.requestCommentFlag === 'Y') {
      this.btnApprove = true;
    }
    if (reject && this.data.data.answerCommentFlag === 'Y' && this.data.data.requestCommentFlag === 'Y') {
      this.btnReject = true;
    }
    if (this.data.typeUser === 1 && this.data.data.answerCommentFlag === 'N' && this.data.data.requestCommentFlag === 'N' && (this.data.data.commentNote !== ' ' && this.data.data.commentNote != null)) {
      this.btnSend = false;
    }
    console.log('this.btnSend', this.btnSend);
    console.log(this.btnApprove, this.btnReject, this.btnComment, this.btnAnswer);
  }

  getComment() {
    if (this.data.data.commentNote != null) {
      this.comment = this.data.data.commentNote.split('$/N');
    }
  }

  get f() {
    return this.addComment.controls;
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


  onApproveComment() {
    this.loading.show();
    this.data.data.answerCommentFlag = 'N';
    this.data.data.requestCommentFlag = 'N';
    this.processSaveComment('approve');
  }

  onRejectComment() {
    this.loading.show();
    this.data.data.requestCommentFlag = 'Y';
    this.data.data.answerCommentFlag = 'N';
    this.processSaveComment('reject');
  }

  onSaveComment() {
    this.loading.show();
    let comment = this.addComment.controls['strComment'].value;
    let userName = this.sessionService.getUserProfile().localFirstName + ' : ';
    let newComment = userName;
    let mode = 'save';
    if (this.data.data.commentNote != null) {
      newComment = this.data.data.commentNote + '$/N' + userName;
    }
    this.data.data.commentNote = newComment + comment;
    const hasPriceAnswer = this.sessionService.checkProfileIsContainObject('PRICE_FN_ANSWER_COMMENT');
    const hasRelativeAnswer = this.sessionService.checkProfileIsContainObject('REVIEW_FN_ANSWER_COMMENT');
    const hasPriceCreate = this.sessionService.checkProfileIsContainObject('PRICE_FN_CREATE_COMMENT');
    const hasRelativeCreate = this.sessionService.checkProfileIsContainObject('REVIEW_FN_CREATE_COMMENT');
    if (hasPriceCreate || hasRelativeCreate) {
      if (this.data.data.requestCommentFlag === 'N'
        && this.data.data.answerCommentFlag === 'N'
        && this.data.data.commentFlag === 'N') {
        mode = 'new';
      }
      this.data.data.requestCommentFlag = 'Y';
      this.data.data.answerCommentFlag = 'N';
      this.data.data.commentFlag = 'Y';
    } else if ((hasPriceAnswer || hasRelativeAnswer)) {
      this.data.data.answerCommentFlag = 'Y';
    }
    console.log("this.data.data", this.data.data);
    console.log(this.commemtSaveRequest);
    this.processSaveComment(mode);

  }

  private processSaveComment(mode: string): void {
    if (this.data.page === 'keyin') {
      this.commemtSaveRequest.baseYear = this.data.data.baseYearId;
      this.commemtSaveRequest.yearTerm = this.data.data.yearTerm;
      this.commemtSaveRequest.monthTerm = this.data.data.monthTerm;
      this.commemtSaveRequest.dataMatrixId = this.data.data.dataMatrixId;
      this.commemtSaveRequest.requestCommentFlag = this.data.data.requestCommentFlag;
      this.commemtSaveRequest.answerCommentFlag = this.data.data.answerCommentFlag;
      this.commemtSaveRequest.commentNote = this.data.data.commentNote;
      this.commemtSaveRequest.commentFlag = this.data.data.commentFlag;
      this.keydailyService.saveComment(this.commemtSaveRequest).subscribe(
        (res) => {
          this.loading.hide();
          this.processReplyWorkflow();
        }, (error) => {
          this.loading.hide();
          this.dialogRef.close();
        }
      );
    } else if (this.data.page === 'commodity') {
      this.commemtSaveRequest.baseYear = this.data.data.baseYearId;
      this.commemtSaveRequest.yearTerm = this.data.data.yearTerm;
      this.commemtSaveRequest.monthTerm = this.data.data.monthTerm;
      this.commemtSaveRequest.cpaId = this.data.data.cpaId;
      this.commemtSaveRequest.requestCommentFlag = this.data.data.requestCommentFlag;
      this.commemtSaveRequest.answerCommentFlag = this.data.data.answerCommentFlag;
      this.commemtSaveRequest.commentNote = this.data.data.commentNote;
      this.commemtSaveRequest.commentFlag = this.data.data.commentFlag;
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
    } else if (this.data.page === 'inspect') {
      this.commemtSaveRequest.baseYear = this.data.data.baseYearIdPk;
      this.commemtSaveRequest.yearTerm = this.data.data.yearTermPk;
      this.commemtSaveRequest.monthTerm = this.data.data.monthTermPk;
      this.commemtSaveRequest.dataMatrixId = this.data.data.dataMatrixIdPk;
      this.commemtSaveRequest.requestCommentFlag = this.data.data.requestCommentFlag;
      this.commemtSaveRequest.answerCommentFlag = this.data.data.answerCommentFlag;
      this.commemtSaveRequest.commentNote = this.data.data.commentNote;
      this.commemtSaveRequest.commentFlag = this.data.data.commentFlag;
      this.keydailyService.saveComment(this.commemtSaveRequest).subscribe(
        (res) => {
          this.loading.hide()
          if (mode === 'new') {
            this.processInsertWorkflow();
          } else if (mode === 'approve') {
            this.processApproveWorkflow();
          } else {
            this.processReplyWorkflow();
          }
        }, (error) => {
          this.loading.hide();
          this.dialogRef.close();
        }
      );
    }
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
        this.dialogRef.close(this.data.data);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  private processApproveWorkflow(): void {
    let workflowRequest: EditWorkFlowRequest = new EditWorkFlowRequest();
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.dataMatrixId = this.commemtSaveRequest.dataMatrixId;
    const paramWorkflowStatus = this.paramService.getParamByGroupCodeAndInfoCode('REVIEW_PRICE_STATUS', 'APPROVE');
    workflowRequest.status = paramWorkflowStatus.paramInfo;
    this.loading.show();
    this.workflowService.approveReviewPriceWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.data.data);
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
        this.dialogRef.close(this.data.data);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  private processReplyWorkflow(): void {
    let workflowRequest: EditWorkFlowRequest = new EditWorkFlowRequest();
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.dataMatrixId = this.commemtSaveRequest.dataMatrixId;
    this.loading.show();
    this.workflowService.replyReviewPriceWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.data.data);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  private processInsertRelativeWorkflow(): void {
    let workflowRequest: InsertWorkflowRequest = new InsertWorkflowRequest();
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.cpaId = this.commemtSaveRequest.cpaId;
    workflowRequest.assignTo = this.data.data.updatedBy;
    workflowRequest.creatorUrl = '/commodityvalidate';
    const paramWorkflowType = this.paramService.getParamByGroupCodeAndInfoCode('WORKFLOW_TYPE', 'REVIEW_RELATIVE');
    workflowRequest.workflowTypeId = paramWorkflowType.paramId;
    const paramInfoMessage = this.paramService.getParamByGroupCodeAndInfoCode('INFO_MESSAGE', 'REVIEW_RELATIVE');
    const infoMessage = '$1' + this.data.data.frequency + '$1' + this.data.data.parentCommodityCode + '$1'
      + this.data.data.parentCommodityThName + '$1' + this.data.data.surveyName;
    const message = paramInfoMessage.paramLocalMessage.replace('(###1)', infoMessage);
    workflowRequest.note = message.substr(0, 250);
    this.loading.show();
    this.workflowService.insertWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.data.data);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  private processInsertWorkflow(): void {
    let workflowRequest: InsertWorkflowRequest = new InsertWorkflowRequest();
    workflowRequest.baseYearId = this.commemtSaveRequest.baseYear;
    workflowRequest.yearTerm = this.commemtSaveRequest.yearTerm;
    workflowRequest.monthTerm = this.commemtSaveRequest.monthTerm;
    workflowRequest.dataMatrixId = this.commemtSaveRequest.dataMatrixId;
    if (this.data.data.createdBy) {
      workflowRequest.assignTo = this.data.data.createdBy;
    } else {
      workflowRequest.assignTo = this.data.data.updatedBy;
    }
    workflowRequest.creatorUrl = '/commodityvalidate';
    workflowRequest.assignUrl = '/dataenty';
    workflowRequest.cpaId = this.data.data.cpaIdPk;
    const paramWorkflowType = this.paramService.getParamByGroupCodeAndInfoCode('WORKFLOW_TYPE', 'REVIEW_PRICE');
    workflowRequest.workflowTypeId = paramWorkflowType.paramId;
    const paramInfoMessage = this.paramService.getParamByGroupCodeAndInfoCode('INFO_MESSAGE', 'REVIEW_PRICE');
    const infoMessage = '$1' + this.data.data.frequency + '$1' + this.data.data.parentCommodityCode + '$1'
      + this.data.data.parentCommodityThName + '$1' + this.data.data.surveyName;
    const message = paramInfoMessage.paramLocalMessage.replace('(###1)', infoMessage);
    workflowRequest.note = message.substr(0, 250);
    this.loading.show();
    this.workflowService.insertWorkflow(workflowRequest).subscribe(
      (xResp) => {
        this.loading.hide();
        this.dialogRef.close(this.data.data);
      }, (xError) => {
        this.loading.hide();
      }
    );
  }

  onNoClick() {
    this.dialogRef.close();
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

}
