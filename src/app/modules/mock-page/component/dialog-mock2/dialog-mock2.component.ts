import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-dialog-mock2',
  templateUrl: './dialog-mock2.component.html',
  styleUrls: ['./dialog-mock2.component.scss']
})
export class DialogMock2Component implements OnInit {
  type = 2;
  constructor(
    public dialogRef: MatDialogRef<DialogMock2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuiler: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
