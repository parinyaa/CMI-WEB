import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AveragePercentageComponent } from './average-percentage.component';

describe('AveragePercentageComponent', () => {
  let component: AveragePercentageComponent;
  let fixture: ComponentFixture<AveragePercentageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AveragePercentageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AveragePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
