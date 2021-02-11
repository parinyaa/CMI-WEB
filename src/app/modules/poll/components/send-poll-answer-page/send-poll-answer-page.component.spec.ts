import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPollAnswerPageComponent } from './send-poll-answer-page.component';

describe('SendPollAnswerPageComponent', () => {
  let component: SendPollAnswerPageComponent;
  let fixture: ComponentFixture<SendPollAnswerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendPollAnswerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPollAnswerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
