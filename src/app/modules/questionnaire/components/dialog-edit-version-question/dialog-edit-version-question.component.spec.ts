import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditVersionQuestionComponent } from './dialog-edit-version-question.component';

describe('DialogEditVersionQuestionComponent', () => {
  let component: DialogEditVersionQuestionComponent;
  let fixture: ComponentFixture<DialogEditVersionQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditVersionQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditVersionQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
