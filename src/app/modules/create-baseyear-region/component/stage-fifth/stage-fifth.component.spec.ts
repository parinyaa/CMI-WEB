import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageFifthComponent } from './stage-fifth.component';

describe('StageFifthComponent', () => {
  let component: StageFifthComponent;
  let fixture: ComponentFixture<StageFifthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageFifthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageFifthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
