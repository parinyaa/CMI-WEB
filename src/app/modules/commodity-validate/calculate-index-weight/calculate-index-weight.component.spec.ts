import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateIndexWeightComponent } from './calculate-index-weight.component';

describe('CalculateIndexWeightComponent', () => {
  let component: CalculateIndexWeightComponent;
  let fixture: ComponentFixture<CalculateIndexWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateIndexWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateIndexWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
