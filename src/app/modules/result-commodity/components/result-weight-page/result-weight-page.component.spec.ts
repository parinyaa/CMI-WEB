import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultWeightPageComponent } from './result-weight-page.component';

describe('ResultWeightPageComponent', () => {
  let component: ResultWeightPageComponent;
  let fixture: ComponentFixture<ResultWeightPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultWeightPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultWeightPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
