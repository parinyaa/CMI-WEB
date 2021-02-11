import { SessionServiceService } from './../../core/service/common/session-service.service';
import { Router } from '@angular/router';
import { AuthRequest } from './../../shared/models/request/auth-request';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from 'src/app/core/service/user/authservice.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  
  loginForm:FormGroup;
  submitted = false;
  signinLoading = false;
  msgError:string;
  constructor(
    private _formBuilder:FormBuilder,
    private authService:AuthserviceService,
    private authRequest:AuthRequest,
    private router:Router,
    private location:Location,
    private sessionService: SessionServiceService,
  ) { }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      userCode:['',Validators.required],
      password:['',Validators.required]
    })
  }


  onAuthUserlogin(){
    this.signinLoading = true;
    console.log(this.loginForm.value);
    this.authRequest.userCode = this.loginForm.controls['userCode'].value;
    this.authRequest.password = this.loginForm.controls['password'].value;
    this.authRequest.isIamAdmin = 'N';
    this.authService.signIn(this.authRequest)
    .subscribe(
      (res) => {
        this.msgError = "";
        this.getCurrentUser();
        this.signinLoading = false;
        console.log(res);
        this.sessionService.setIsSaved(true);
      },
      (error) => {
        this.signinLoading = false;
        console.log("aaaaa" ,error);
        if(error.error.code === "E0101"){
          window.location.href = 'https://prior-iam-dev.firebaseapp.com/activateuser/'+this.loginForm.controls['userCode'].value;
        }
        this.msgError = error.error.messageEn;
      }
    )
  }

  getCurrentUser(){
    this.authService.getCurrentUser().subscribe(
      (res) => {
        this.router.navigate(['/']);
      }, (error) => {
        console.log(error);
      }
    )
  }

  get f(){ return this.loginForm.controls}

  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log(this.loginForm);
      return;
    }else{
      this.onAuthUserlogin();
    }
  }

}
