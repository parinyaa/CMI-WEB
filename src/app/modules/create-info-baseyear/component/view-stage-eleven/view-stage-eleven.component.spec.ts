import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageElevenComponent } from './view-stage-eleven.component';

describe('ViewStageElevenComponent', () => {
  let component: ViewStageElevenComponent;
  let fixture: ComponentFixture<ViewStageElevenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageElevenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageElevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
