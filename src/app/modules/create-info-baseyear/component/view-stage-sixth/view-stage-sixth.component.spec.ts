import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageSixthComponent } from './view-stage-sixth.component';

describe('ViewStageSixthComponent', () => {
  let component: ViewStageSixthComponent;
  let fixture: ComponentFixture<ViewStageSixthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageSixthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageSixthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
