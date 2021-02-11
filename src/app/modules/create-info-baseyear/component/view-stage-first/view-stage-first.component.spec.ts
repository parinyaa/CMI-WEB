import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageFirstComponent } from './view-stage-first.component';

describe('ViewStageFirstComponent', () => {
  let component: ViewStageFirstComponent;
  let fixture: ComponentFixture<ViewStageFirstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
