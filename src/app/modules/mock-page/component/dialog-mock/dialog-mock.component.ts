import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-dialog-mock',
  templateUrl: './dialog-mock.component.html',
  styleUrls: ['./dialog-mock.component.scss']
})
export class DialogMockComponent implements OnInit {

  selected = 1;
  constructor(
    public dialogRef: MatDialogRef<DialogMockComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuiler: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
