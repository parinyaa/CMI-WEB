import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageSecondComponent } from './stage-second.component';

describe('StageSecondComponent', () => {
  let component: StageSecondComponent;
  let fixture: ComponentFixture<StageSecondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageSecondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
