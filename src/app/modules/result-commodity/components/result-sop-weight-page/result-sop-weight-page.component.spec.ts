import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSopWeightPageComponent } from './result-sop-weight-page.component';

describe('ResultSopWeightPageComponent', () => {
  let component: ResultSopWeightPageComponent;
  let fixture: ComponentFixture<ResultSopWeightPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSopWeightPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSopWeightPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
