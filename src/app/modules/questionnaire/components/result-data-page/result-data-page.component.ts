import { Component, OnInit } from '@angular/core';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNull } from 'util';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogRemarkPollDataComponent } from '../dialog-remark-poll-data/dialog-remark-poll-data.component';

@Component({
  selector: 'app-result-data-page',
  templateUrl: './result-data-page.component.html',
  styleUrls: ['./result-data-page.component.scss']
})
export class ResultDataPageComponent implements OnInit {

  questionEntries = new Map();
  displayedColumns: string[] = ['position', 'description', 'numberAnswer', 'percentAnswer', 'action'];

  constructor(
    private questionnaireService: QuestionnaireService,
    private loading: NgxSpinnerService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (isNull(history.state.versionId) || history.state.versionId == undefined) {
      this.router.navigateByUrl('/questionnaire');

    }
    else {
      this.loading.show();
      this.getDataResult(history.state.versionId);
    }
  }

  getDataResult(versionId) {
    this.questionnaireService.getResultPollDataByVersionId(versionId).subscribe((res) => {
      this.loading.hide();
      res.forEach(element => {
        if (isNull(this.questionEntries.get(element.questionDesc)) || this.questionEntries.get(element.questionDesc) == undefined) {
          let arr = new Array();
          arr.push(element);
          this.questionEntries.set(element.questionDesc, arr);
        }
        else {
          let arr = this.questionEntries.get(element.questionDesc);
          arr.push(element);
          this.questionEntries.set(element.questionDesc, arr);
        }
      });
    },
      (error) => {
        this.loading.hide();
      });
  }

  openRemarkDialog(element): void {
    const dialogRef = this.dialog.open(DialogRemarkPollDataComponent, {
      width: '700px',
      position: {
        top: '10%'
      },
      data: element.answerId
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
