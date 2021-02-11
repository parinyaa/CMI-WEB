import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionQuestionPageComponent } from './version-question-page.component';

describe('VersionQuestionPageComponent', () => {
  let component: VersionQuestionPageComponent;
  let fixture: ComponentFixture<VersionQuestionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionQuestionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionQuestionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
