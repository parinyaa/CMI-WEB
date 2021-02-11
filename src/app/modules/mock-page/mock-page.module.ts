import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockPageRoutingModule } from './mock-page-routing.module';
import { DialogMockComponent } from './component/dialog-mock/dialog-mock.component';
import { PageComponent } from './page/page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DialogMock2Component } from './component/dialog-mock2/dialog-mock2.component';


@NgModule({
  declarations: [DialogMockComponent, PageComponent, DialogMock2Component],
  imports: [
    CommonModule, 
    MockPageRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  entryComponents: [DialogMockComponent,DialogMock2Component]
})
export class MockPageModule { }
