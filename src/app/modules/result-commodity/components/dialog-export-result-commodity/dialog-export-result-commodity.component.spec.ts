import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExportResultCommodityComponent } from './dialog-export-result-commodity.component';

describe('DialogExportResultCommodityComponent', () => {
  let component: DialogExportResultCommodityComponent;
  let fixture: ComponentFixture<DialogExportResultCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExportResultCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExportResultCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
