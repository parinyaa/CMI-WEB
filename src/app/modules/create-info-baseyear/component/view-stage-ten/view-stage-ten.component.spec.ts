import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStageTenComponent } from './view-stage-ten.component';

describe('ViewStageTenComponent', () => {
  let component: ViewStageTenComponent;
  let fixture: ComponentFixture<ViewStageTenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStageTenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStageTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
