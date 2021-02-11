import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddVersionQuestionComponent } from './dialog-add-version-question.component';

describe('DialogAddVersionQuestionComponent', () => {
  let component: DialogAddVersionQuestionComponent;
  let fixture: ComponentFixture<DialogAddVersionQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddVersionQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddVersionQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
