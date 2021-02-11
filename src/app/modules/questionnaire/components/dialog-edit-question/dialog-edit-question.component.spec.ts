import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditQuestionComponent } from './dialog-edit-question.component';

describe('DialogEditQuestionComponent', () => {
  let component: DialogEditQuestionComponent;
  let fixture: ComponentFixture<DialogEditQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
