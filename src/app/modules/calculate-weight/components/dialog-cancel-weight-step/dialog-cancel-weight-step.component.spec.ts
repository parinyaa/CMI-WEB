import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCancelWeightStepComponent } from './dialog-cancel-weight-step.component';

describe('DialogCancelWeightStepComponent', () => {
  let component: DialogCancelWeightStepComponent;
  let fixture: ComponentFixture<DialogCancelWeightStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCancelWeightStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCancelWeightStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
