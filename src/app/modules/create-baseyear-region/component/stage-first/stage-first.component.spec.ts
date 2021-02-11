import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageFirstComponent } from './stage-first.component';

describe('StageFirstComponent', () => {
  let component: StageFirstComponent;
  let fixture: ComponentFixture<StageFirstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageFirstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
