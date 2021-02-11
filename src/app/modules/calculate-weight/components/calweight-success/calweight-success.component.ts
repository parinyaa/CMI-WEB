import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calweight-success',
  templateUrl: './calweight-success.component.html',
  styleUrls: ['./calweight-success.component.scss']
})
export class CalweightSuccessComponent implements OnInit {
  @ViewChild('saveWeightSuccess',{static:false}) saveWeightSuccess:SwalComponent;
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = ['id','weight','code'];
  constructor(
    private loading:NgxSpinnerService,
    private router:Router
  ) { }
  
  ngOnInit() {
    this.loading.show();
    this.dataSource = new MatTableDataSource(history.state.result);
    if(history.state.result == undefined){
      this.router.navigateByUrl("/calculateweight");
    }
    setTimeout(() => {
      this.loading.hide();
    }, 1000);
    console.log(history.state);
  }

  onSaveWeight(){
    this.saveWeightSuccess.show();
  }

}
