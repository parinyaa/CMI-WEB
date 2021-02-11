import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageSeventhComponent } from './view-stage-seventh.component';

describe('ViewStageSeventhComponent', () => {
  let component: ViewStageSeventhComponent;
  let fixture: ComponentFixture<ViewStageSeventhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageSeventhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageSeventhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
