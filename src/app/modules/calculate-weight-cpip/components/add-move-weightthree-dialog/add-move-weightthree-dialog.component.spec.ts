import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoveWeightthreeDialogComponent } from './add-move-weightthree-dialog.component';

describe('AddMoveWeightthreeDialogComponent', () => {
  let component: AddMoveWeightthreeDialogComponent;
  let fixture: ComponentFixture<AddMoveWeightthreeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoveWeightthreeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoveWeightthreeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
