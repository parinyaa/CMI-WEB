import { Component, OnInit } from '@angular/core';
import { ParamService } from '../service/param/param.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  constructor(
    private paramService: ParamService,
    private loading: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.inquiryParams();
  }
  inquiryParams() {
    this.loading.show();
    this.paramService.getParamsGroup().subscribe((res) => {
      this.loading.hide();
     localStorage.setItem('params', JSON.stringify(res));
    }, (error) => {
      this.loading.hide();
    });
  }
}
