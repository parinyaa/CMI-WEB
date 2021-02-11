import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageFouthComponent } from './stage-fouth.component';

describe('StageFouthComponent', () => {
  let component: StageFouthComponent;
  let fixture: ComponentFixture<StageFouthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageFouthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageFouthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
