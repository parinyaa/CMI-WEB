import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, PageEvent, MatTableDataSource, DateAdapter } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { QuestionnaireService } from 'src/app/core/service/questionnaire/questionnaire.service';

@Component({
  selector: 'app-dialog-remark-poll-data',
  templateUrl: './dialog-remark-poll-data.component.html',
  styleUrls: ['./dialog-remark-poll-data.component.scss']
})
export class DialogRemarkPollDataComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['position', 'remark'];

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100, 500, 1000];
  pageEvent: PageEvent = new PageEvent;

  page = 0;
  size = 10;
  index = 0;

  answerId;

  constructor(
    public dialogRef: MatDialogRef<DialogRemarkPollDataComponent>,
    private loading: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private questionnaireService: QuestionnaireService,
    private dateAdapter: DateAdapter<Date>,
  ) {
    dateAdapter.setLocale('th-TH');
  }

  ngOnInit() {
    this.answerId = this.data;
    this.getAllPollDataByAnswerId(this.answerId, this.page, this.size);
  }

  pageChange(e: PageEvent): PageEvent {
    this.index = e.pageIndex * e.pageSize;
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.getAllPollDataByAnswerId(this.answerId, this.page, this.size);
    return e;
  }

  getAllPollDataByAnswerId(id, page, size) {
    this.questionnaireService.getPollDataByAnswerId(id, page, size).subscribe((res) => {
      if (res.content.length > 0) {
        this.length = res.totalElements;
        this.dataSource = new MatTableDataSource(res.content);
      }
    },
      (error) => {
      })
  }

}
