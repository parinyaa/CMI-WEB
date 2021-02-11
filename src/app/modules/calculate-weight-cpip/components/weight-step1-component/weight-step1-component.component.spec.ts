import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightStep1ComponentComponent } from './weight-step1-component.component';

describe('WeightStep1ComponentComponent', () => {
  let component: WeightStep1ComponentComponent;
  let fixture: ComponentFixture<WeightStep1ComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightStep1ComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightStep1ComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
