import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkflowService } from 'src/app/core/service/workflow/workflow.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ParamService } from 'src/app/core/service/param/param.service';
import { SessionServiceService } from 'src/app/core/service/common/session-service.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  showExtendedPeriod = false;
  showRelative = false;
  showPrice = false;

  extendedPeriod = false;
  reviewRelative = false;
  reviewPrice = false;

  constructor(
    public sessionService: SessionServiceService,
    private router: Router,
  ) {
    this.checkObject();
  }

  ngOnInit() {

  }

  changeMode(mode) {
    if (mode == 'extended') {
      this.router.navigate(['/period']);
    }
    else if (mode == 'relative') {
      this.router.navigate(['/relative']);
    }
    else if (mode == 'price') {
      // this.router.navigate(['/price']);
      this.router.navigate(['/price'], {
        queryParams: { time: new Date().getTime() }
      });
    }
  }

  checkObject() {
    const userProfile = this.sessionService.getUserProfile();
    userProfile.objects.forEach(element => {
      if (element == 'WF_EXTENDED_PERIOD') {
        this.extendedPeriod = true
      }
      else if (element == 'WF_REVIEW_RELATIVE') {
        this.reviewRelative = true;
      }
      else if (element == 'WF_REVIEW_PRICE') {
        this.reviewPrice = true;
      }
    });
    if (this.extendedPeriod) {
      this.changeMode('extended');
    }
    else if (!this.extendedPeriod && this.reviewPrice) {
      this.changeMode('price');
    }
    else if (!this.extendedPeriod && this.reviewRelative && !this.reviewPrice) {
      this.changeMode('relative');
    }
  }

  refresh() {

  }





}
