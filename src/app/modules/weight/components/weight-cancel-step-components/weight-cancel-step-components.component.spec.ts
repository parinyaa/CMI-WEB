import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightCancelStepComponentsComponent } from './weight-cancel-step-components.component';

describe('WeightCancelStepComponentsComponent', () => {
  let component: WeightCancelStepComponentsComponent;
  let fixture: ComponentFixture<WeightCancelStepComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightCancelStepComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightCancelStepComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
