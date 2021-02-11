import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistoryWeightComponent } from './dialog-history-weight.component';

describe('DialogHistoryWeightComponent', () => {
  let component: DialogHistoryWeightComponent;
  let fixture: ComponentFixture<DialogHistoryWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHistoryWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHistoryWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
