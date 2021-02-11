import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryStepComponent } from './history-step.component';

describe('HistoryStepComponent', () => {
  let component: HistoryStepComponent;
  let fixture: ComponentFixture<HistoryStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
