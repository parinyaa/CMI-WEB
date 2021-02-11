import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoveWeightDialogComponent } from './add-move-weight-dialog.component';

describe('AddMoveWeightDialogComponent', () => {
  let component: AddMoveWeightDialogComponent;
  let fixture: ComponentFixture<AddMoveWeightDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoveWeightDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoveWeightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
