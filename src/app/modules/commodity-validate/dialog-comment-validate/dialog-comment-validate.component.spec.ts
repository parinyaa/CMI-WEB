import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCommentValidateComponent } from './dialog-comment-validate.component';

describe('DialogCommentValidateComponent', () => {
  let component: DialogCommentValidateComponent;
  let fixture: ComponentFixture<DialogCommentValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCommentValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCommentValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
