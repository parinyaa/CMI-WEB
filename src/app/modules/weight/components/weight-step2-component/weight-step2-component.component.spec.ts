import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightStep2ComponentComponent } from './weight-step2-component.component';

describe('WeightStep2ComponentComponent', () => {
  let component: WeightStep2ComponentComponent;
  let fixture: ComponentFixture<WeightStep2ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightStep2ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightStep2ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
