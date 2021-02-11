import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightStep3ComponentComponent } from './weight-step3-component.component';

describe('WeightStep3ComponentComponent', () => {
  let component: WeightStep3ComponentComponent;
  let fixture: ComponentFixture<WeightStep3ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightStep3ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightStep3ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
