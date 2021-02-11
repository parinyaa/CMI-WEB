import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdjustPweightDialogComponent } from './add-adjust-pweight-dialog.component';

describe('AddAdjustPweightDialogComponent', () => {
  let component: AddAdjustPweightDialogComponent;
  let fixture: ComponentFixture<AddAdjustPweightDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdjustPweightDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdjustPweightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
