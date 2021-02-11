import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightStep4ComponentComponent } from './weight-step4-component.component';

describe('WeightStep4ComponentComponent', () => {
  let component: WeightStep4ComponentComponent;
  let fixture: ComponentFixture<WeightStep4ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightStep4ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightStep4ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
