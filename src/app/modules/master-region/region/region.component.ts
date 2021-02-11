import { SessionServiceService } from './../../../core/service/common/session-service.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DialogEditregionComponent } from './componets/dialog-editregion/dialog-editregion.component';
import { DialogAddregionComponent } from './componets/dialog-addregion/dialog-addregion.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { RegionResponse } from '../../../shared/models/responses/regionResponse';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RegionService } from 'src/app/core/service/region/region.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Message } from 'src/app/shared/message';
import { ParamService } from 'src/app/core/service/param/param.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParamInfo } from '../../master-params/model/param';


export interface RegionElement {
  name: string;
  regionCode: string;

}

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {
  @ViewChild('succussDeleteSwal', { static: false }) succussDeleteSwal: SwalComponent;
  @ViewChild('errorSwal', { static: false }) errorSwal: SwalComponent;
  region = new Array();
  noDataRegion = false;
  defaultElevation = 2;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  constructor(
    private regionService: RegionService,
    private loading: NgxSpinnerService,
    private dialog: MatDialog,
    private router: Router,
    private sessionService: SessionServiceService,
    private paramService: ParamService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getRegion();
  }

  getRegion() {
    this.loading.show();
    this.regionService.getRegion()
      .subscribe(
        (res) => {
          console.log(res);
          this.region = res;
          if (this.region.length == 0) { this.noDataRegion = true; }
          this.loading.hide();
        },
        (error) => {
          this.region = [];
          this.loading.hide();
          this.noDataRegion = true;
        }
      )
  }
  getParamGroup() {
    this.loading.show();
    this.paramService.getParamsGroup().subscribe(
      (res) => {
        console.log('paramCode res', res);
        // this.paramGroup = res;
        this.loading.hide();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  onErrorSwal() {
    let msg = this.paramService.getParamByGroupCodeAndInfoCode("INFO_MESSAGE", "ADD_EDIT_DEL_ACTION") as ParamInfo;
    this.errorSwal.title = msg ? msg.paramLocalMessage : "";
    this.errorSwal.type = "warning";
    this.errorSwal.show();
  }


  onAddRegion(): void {
    const dialogRef = this.dialog.open(DialogAddregionComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRegion();
      }
    });
  }

  onEditRegion(data): void {
    const dialogRef = this.dialog.open(DialogEditregionComponent, {
      width: '550px',
      position: {
        top: '10%'
      },
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRegion();
      }
    });
  }

  onDeleteRegion(e) {
    this.loading.show();
    this.regionService.deleteRegion(e.regionCode).subscribe(
      (res) => {
        this.loading.hide();
        this.succussDeleteSwal.show();
        this.getRegion();
      },
      (error) => {
        this.loading.hide();
      }
    )
  }

  goToProvince(data) {
    console.log(data);
    this.sessionService.setBreadcrumb(data.regionName, "", "", "");
    this.router.navigateByUrl('region/province', { state: { 'regionId': data.regionId, 'provinceId': 0 } });
  }

}
