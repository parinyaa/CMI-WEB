import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageThirdComponent } from './stage-third.component';

describe('StageThirdComponent', () => {
  let component: StageThirdComponent;
  let fixture: ComponentFixture<StageThirdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageThirdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
