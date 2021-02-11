import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAnswerComponent } from './dialog-answer.component';

describe('DialogAnswerComponent', () => {
  let component: DialogAnswerComponent;
  let fixture: ComponentFixture<DialogAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
