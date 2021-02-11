import localeTh  from '@angular/common/locales/th';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Compare} from '../models/inbox';
import {InboxDetail} from '../models/inbox-details';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-popup-inboxdetail-detail',
  templateUrl: './popup-inboxdetail-detail.component.html',
  styleUrls: ['./popup-inboxdetail-detail.component.scss']
})
export class PopupInboxdetailDetailComponent implements OnInit {
  inboxDetails: MatTableDataSource<InboxDetail>;
  columnDefined: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  constructor(
    public dialogRef: MatDialogRef<PopupInboxdetailDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    registerLocaleData(localeTh,'th');
  }

  ngOnInit() {
    console.log(this.data);
    const data: Array<InboxDetail> = new Array<InboxDetail>();
    data.push(this.data);
    this.inboxDetails = new MatTableDataSource<InboxDetail>(data);
  }

}
