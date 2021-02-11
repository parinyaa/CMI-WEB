import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageFouthComponent } from './view-stage-fouth.component';

describe('ViewStageFouthComponent', () => {
  let component: ViewStageFouthComponent;
  let fixture: ComponentFixture<ViewStageFouthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageFouthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageFouthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
