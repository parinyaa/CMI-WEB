import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompareWeightComponent } from './dialog-compare-weight.component';

describe('DialogCompareWeightComponent', () => {
  let component: DialogCompareWeightComponent;
  let fixture: ComponentFixture<DialogCompareWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCompareWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCompareWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
