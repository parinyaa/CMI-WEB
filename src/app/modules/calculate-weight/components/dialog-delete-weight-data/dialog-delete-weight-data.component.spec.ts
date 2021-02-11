import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteWeightDataComponent } from './dialog-delete-weight-data.component';

describe('DialogDeleteWeightDataComponent', () => {
  let component: DialogDeleteWeightDataComponent;
  let fixture: ComponentFixture<DialogDeleteWeightDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDeleteWeightDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteWeightDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
