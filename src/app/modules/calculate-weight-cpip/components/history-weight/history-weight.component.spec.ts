import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryWeightComponent } from './history-weight.component';

describe('HistoryWeightComponent', () => {
  let component: HistoryWeightComponent;
  let fixture: ComponentFixture<HistoryWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
