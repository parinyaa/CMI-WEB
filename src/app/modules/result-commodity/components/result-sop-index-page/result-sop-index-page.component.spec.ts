import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultSopIndexPageComponent } from './result-sop-index-page.component';

describe('ResultSopIndexPageComponent', () => {
  let component: ResultSopIndexPageComponent;
  let fixture: ComponentFixture<ResultSopIndexPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSopIndexPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSopIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
