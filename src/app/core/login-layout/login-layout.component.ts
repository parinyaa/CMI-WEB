import { Component, OnInit } from '@angular/core';
import { ParamService } from '../service/param/param.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  constructor(
    private paramService: ParamService,
    private loading: NgxSpinnerService,
  ) {
    // this.inquiryParams();
  }

  ngOnInit() {
    // this.inquiryParams();
  }
  // inquiryParams() {
  //   this.loading.show();
  //   this.paramService.getParamsGroup().subscribe((res) => {
  //     this.loading.hide();
  //     console.log(res)
  //     if (res.code === '200') {
        
  //       localStorage.setItem('params', JSON.stringify(res));
  //     }
  //     else {

  //     }
  //   }, (error) => {
  //     this.loading.hide();
  //   });
  // }
}
