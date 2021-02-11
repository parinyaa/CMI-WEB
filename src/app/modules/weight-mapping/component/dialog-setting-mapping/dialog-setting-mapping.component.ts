import { Component, OnInit, Inject, ViewChild, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WeightMappingService } from 'src/app/core/service/weight-mapping/weight-mapping.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateWeightMappingRequest } from 'src/app/shared/models/weight/request/WeightMapping';
import { View } from '@fullcalendar/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
@Component({
  selector: 'app-dialog-setting-mapping',
  templateUrl: './dialog-setting-mapping.component.html',
  styleUrls: ['./dialog-setting-mapping.component.scss']
})
export class DialogSettingMappingComponent implements OnInit {
  @ViewChild('succussSwal', { static: false }) succussSwal: SwalComponent;
  @ViewChild('addSwal', { static: false }) addSwal: SwalComponent;
  
  commodity = new Array();
  filteredOptions: Observable<any[]>;
  commodityActive: any
  commodityName: string = "";
  weightCode: string = "";
  weightDesc: string = "";
  formGroup: FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<DialogSettingMappingComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UpdateWeightMappingRequest,
    private weightMappingService: WeightMappingService,
    private loaging: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
    this.setFormGroup(null);
  }

  async ngOnInit() {
    console.log(this.data);
    await this.getCommodity().then((res) => {
      this.commodity = res;
      this.setFormGroup(this.data);
      this.filteredOptions = this.formGroup.get('commodityCode').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
  }

  setFormGroup(data) {
    this.formGroup = this.formBuilder.group({
      weightCode: [data ? data.weightCode : null, Validators.required],
      weightName: [data ? data.weightDesc : null, Validators.required],
      commodityCode: [data ? data.commodityCode : null, Validators.required],
      commodityName: [data ? data.commodityName : null]
    })
    if (this.data) {
      // this.formGroup.get('weightCode').disable();
      const commodity = this.commodity.find(x => x.commodityCode === this.data.commodityCode);
      this.formGroup.get('commodityCode').setValue(commodity);
    }
  }

  async getCommodity() {
    this.loaging.show();
    const commodity = await this.weightMappingService.inquiryCommodityCode().toPromise();
    this.loaging.hide();
    return commodity;
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.commodity.filter(option => option.commodityCode.toLowerCase().includes(filterValue));
  }

  displayFn(val: any) {
    return val ? val.commodityCode : val;
  }

  selectCPA(event) {
    this.commodityActive = event.option && event.option.value ? event.option.value : '';
    this.formGroup.get("commodityName").setValue(this.commodityActive ? this.commodityActive.commodityName : '');
  }

  onUpdate() {
    this.loaging.show();
    let request = new UpdateWeightMappingRequest();
    request.weightMappingId = this.data ? this.data.weightMappingId : null;
    request.cpipId = this.commodityActive.cpipId;
    request.commodityCode = this.commodityActive.commodityCode;
    request.weightCode = this.formGroup.get("weightCode").value;
    request.weightDesc = this.formGroup.get("weightName").value;
    this.weightMappingService.updateWeightMapping(request).toPromise().then(
      (res) => {
        this.loaging.hide();
        this.succussSwal.show();
      }, (error) => {
        this.loaging.hide();
      }
    )
  }

  get formControl() {
    return this.formGroup.controls
  }

  onSubmit() {
    this.submitted = true;
    const checkCpip = this.onBulrSelect();
    if (!checkCpip) {
      this.formGroup.get("commodityCode").setErrors({ required: true });
      return
    }
    if (this.formGroup.invalid) {
      return
    } else {
      this.addSwal.show();
    }
  }

  onBulrSelect() {
    const cpipSelect = this.formGroup.get("commodityCode").value;
    const checkCpip = this.commodity.find(c => c.commodityCode === ((typeof cpipSelect === 'object') ? cpipSelect.commodityCode : cpipSelect));
    console.log(checkCpip);
    if (checkCpip) {
      this.commodityActive = checkCpip;
      this.formGroup.get("commodityCode").setValue(checkCpip);
      this.formGroup.get("commodityName").setValue(checkCpip.commodityName);
      return true;
    } else {
      return false;
    }
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  forceUppercaseConditionally(formControlName, event) {
    this.formGroup.get(formControlName).setValue(event.target.value.toUpperCase());
  }

}
