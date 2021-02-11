import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageFifthComponent } from './view-stage-fifth.component';

describe('ViewStageFifthComponent', () => {
  let component: ViewStageFifthComponent;
  let fixture: ComponentFixture<ViewStageFifthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageFifthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageFifthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
