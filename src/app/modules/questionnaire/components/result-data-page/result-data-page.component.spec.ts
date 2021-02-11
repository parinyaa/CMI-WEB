import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultDataPageComponent } from './result-data-page.component';

describe('ResultDataPageComponent', () => {
  let component: ResultDataPageComponent;
  let fixture: ComponentFixture<ResultDataPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultDataPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
